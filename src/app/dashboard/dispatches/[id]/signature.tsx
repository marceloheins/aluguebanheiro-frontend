"use client";

import { useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import SignatureScreen from 'react-native-signature-canvas';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { saveDispatchOffline } from '../../../../services/offlineStorage';

export default function SignatureCaptureScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const signatureRef = useRef<any>(null);

  const handleSignature = (signatureBase64: string) => {
    try {
      saveDispatchOffline({
        dispatchId: id,
        notes: 'Entrega finalizada com sucesso na obra.',
        signatureUri: signatureBase64,
        photoUri: 'placeholder_photo_uri',
      });

      Alert.alert('Sucesso', 'Assinatura capturada e salva offline com sucesso!');
      router.back();
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Comprovante de Entrega</Text>
        <Text style={styles.subtitle}>Solicite para o responsável na obra assinar abaixo.</Text>
      </View>

      <View style={styles.signatureContainer}>
        <SignatureScreen
          ref={signatureRef}
          onOK={handleSignature}
          onEmpty={handleEmpty}
          descriptionText="Assine aqui"
          clearText="Limpar"
          confirmText="Salvar"
          webStyle={styleWebView}
        />
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={handleClear} style={[styles.button, styles.clearButton]}>
          <Text style={styles.clearButtonText}>Limpar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleConfirm} style={[styles.button, styles.confirmButton]}>
          <Text style={styles.confirmButtonText}>Confirmar Assinatura</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
  },
  header: {
    marginBottom: 16,
    paddingTop: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  signatureContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#f9fafb',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 16,
    paddingBottom: 24,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButton: {
    backgroundColor: '#e5e7eb',
  },
  clearButtonText: {
    color: '#374151',
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: '#2563eb',
  },
  confirmButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

const styleWebView = `
  .m-signature-pad { box-shadow: none; border: none; }
  .m-signature-pad--body { border: none; }
  .m-signature-pad--footer { display: none; margin: 0px; }
  body, html { width: 100%; height: 100%; }
`;