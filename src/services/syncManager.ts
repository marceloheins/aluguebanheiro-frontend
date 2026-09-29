// src/services/SyncManager.ts
import { getDb } from './database';
import { api } from '../lib/api';
import * as FileSystem from 'expo-file-system';

export class SyncManager {
  /**
   * Varre o banco local (SQLite) e tenta sincronizar todas as OS pendentes.
   */
  static async syncPendingDispatches() {
    const db = getDb();
    
    // 1. Busca todas as OS concluídas offline que ainda não subiram
    const pendingDispatches = db.getAllSync(
      `SELECT * FROM local_dispatches WHERE synced = 0;`
    ) as any[];

    if (pendingDispatches.length === 0) return;

    console.log(`Iniciando sincronização de ${pendingDispatches.length} OS(s)...`);

    for (const dispatch of pendingDispatches) {
      try {
        let signatureFileKey = null;

        // 2. Se existe uma assinatura capturada, faz o upload para o S3 primeiro
        if (dispatch.signatureUri) {
          signatureFileKey = await this.uploadToS3(dispatch.signatureUri, 'signatures', `sig_${dispatch.dispatchId}.png`);
        }

        // 3. Com o arquivo no S3, finalizamos a OS na nossa API Node.js
        await api.post('/dispatches/complete', {
          dispatchId: dispatch.dispatchId,
          notes: dispatch.notes,
          attachments: signatureFileKey ? [
            { fileKey: signatureFileKey, type: 'SIGNATURE' }
          ] : [],
        });

        // 4. Se a API retornou sucesso (200 OK), marcamos como sincronizado no SQLite local
        db.runSync(
          `UPDATE local_dispatches SET synced = 1 WHERE id = ?;`,
          [dispatch.id]
        );

        console.log(`OS ${dispatch.dispatchId} sincronizada com sucesso!`);
      } catch (error) {
        // Se a internet cair no meio do for-loop, o try-catch segura o erro
        // e a OS continuará como synced = 0 para tentar novamente na próxima vez.
        console.error(`Falha ao sincronizar OS ${dispatch.dispatchId}:`, error);
      }
    }
  }

  /**
   * Solicita a Presigned URL para a API e faz o upload direto para a AWS.
   */
  private static async uploadToS3(fileUri: string, folder: string, fileName: string): Promise<string> {
    // A. Pede a URL temporária para o backend
    const { data } = await api.post('/uploads/presigned-url', {
      folder,
      fileName,
      contentType: 'image/png', // O canvas exporta PNG por padrão
    });

    const { uploadUrl, fileKey } = data;

    // B. Truque nativo do React Native para converter a URI local em um Blob binário
    const response = await fetch(fileUri);
    const blob = await response.blob();

    // C. Faz o upload binário direto para a AWS S3 (sem passar pela nossa API)
    const s3Response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'image/png',
      },
      body: blob,
    });

    if (!s3Response.ok) {
      throw new Error('Falha no upload para o Amazon S3');
    }

    // Retorna a chave gerada pela API para amarrarmos no banco de dados
    return fileKey;
  }
}