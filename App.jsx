import React, { useState } from 'react';
import { View, Button, Text, ScrollView } from 'react-native';
import * as RNFS from 'react-native-fs';
import * as XLSX from 'xlsx';
import DocumentPicker from 'react-native-document-picker';

const App = () => {
  const [data, setData] = useState([]);

  const pickFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      if (res && res.uri) {
        const fileUri = res.uri;
        const file = await RNFS.readFile(fileUri, 'base64');
        const workbook = XLSX.read(file, { type: 'base64' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        setData(jsonData);
      } else {
        console.error('No file selected');
      }
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('User cancelled the picker');
      } else {
        console.error(error);
      }
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Elegir archivo Excel" onPress={pickFile} />
      <ScrollView style={{ marginTop: 20 }}>
        {data.map((item, index) => (
          <Text key={index} style={{ marginVertical: 5 }}>{JSON.stringify(item)}</Text>
        ))}
      </ScrollView>
    </View>
  );
};

export default App;
