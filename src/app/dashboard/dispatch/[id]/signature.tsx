// src/app/dispatch/[id]/signature.tsx
"use client";

import { useRef } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import SignatureScreen from 'react-native-signature-canvas';
import { useLocalSearchParams, useRouter } from 'expo-router';import { saveDispatchOffline } from '../../../../services/offlineStorage';

export default function SignatureCaptureScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const signatureRef = useRef<any>(null);

  // Executado quando o usuário clica em salvar/confirmar a assinatura
  const handleSignature = (signatureBase64: string) => {
    try {
      // Salva a OS localmente no SQLite com o base64 da assinatura
      saveDispatchOffline({
        dispatchId: id,
        notes: 'Entrega finalizada com sucesso na obra.',
        signatureUri: signatureBase64,
        photoUri: 'placeholder_photo_uri', // Aqui você integraria a foto do local tirada com a câmera do Expo
      });

      Alert.alert('Sucesso', 'Assinatura capturada e salva offline com sucesso!');
      router.back(); // Retorna para a listagem de rotas
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a assinatura localmente.');
    }
  };

  const handleEmpty = () => {
    Alert.alert('Atenção', 'O cliente precisa assinar antes de prosseguir.');
  };

  const handleClear = () => {
    signatureRef.current?.clearSignature();
  };

  const handleConfirm = () => {
    signatureRef.current?.readSignature();
  };

  return (
    <View className="flex-1 bg-white p-4">
      <div className="mb-4 pt-6">
        <h1 className="text-xl font-bold text-gray-900">Comprovante de Entrega</h1>
        <p className="text-sm text-gray-500">Solicite para o responsável na obra assinar abaixo.</p>
      </div>

      {/* Canvas de Assinatura */}
      <div className="flex-1 border border-gray-300 rounded-lg overflow-hidden mb-4 bg-gray-50">
        <SignatureScreen
          ref={signatureRef}
          onOK={handleSignature}
          onEmpty={handleEmpty}
          descriptionText="Assine aqui"
          clearText="Limpar"
          confirmText="Salvar"
          webStyle={style}
        />
      </div>

      {/* Botões de Ação Manuais */}
      <div className="flex gap-4 pb-6">
        <TouchableOpacity
          onPress={handleClear}
          className="flex-1 bg-gray-200 p-4 rounded-md items-center"
        >
          <Text className="text-gray-700 font-bold">Limpar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleConfirm}
          className="flex-1 bg-blue-600 p-4 rounded-md items-center"
        >
          <Text className="text-white font-bold">Confirmar Assinatura</Text>
        </TouchableOpacity>
      </div>
    </View>
  );
}

// Estilização injetada no WebView do canvas para manter o fundo limpo e responsivo
const style = `
  .m-signature-pad { box-shadow: none; border: none; }
  .m-signature-pad--body { border: none; }
  .m-signature-pad--footer { display: none; margin: 0px; }
  body, html { width: 100%; height: 100%; }
`;