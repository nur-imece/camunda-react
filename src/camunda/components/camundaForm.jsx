import React, { useEffect, useRef, useState } from 'react';
import { FormEditor } from '@bpmn-io/form-js-editor';
import '@bpmn-io/form-js-editor/dist/assets/form-js-editor.css';
import '@bpmn-io/form-js/dist/assets/form-js.css';

const CamundaForm = ({ initialSchema, onSchemaChange }) => {
  const [formSchema, setFormSchema] = useState(initialSchema || {
    components: [],
    type: 'default',
    id: 'form-' + Date.now(),
    schemaVersion: 3
  });

  const formEditorRef = useRef(null);
  const editorInstanceRef = useRef(null);

  useEffect(() => {
    if (!formEditorRef.current) return;

    const editor = new FormEditor({
      container: formEditorRef.current,
      properties: {
        description: true,
        label: true,
        validation: true,
        defaultValue: true,
        values: true
      }
    });

    editorInstanceRef.current = editor;

    editor.importSchema(formSchema).then(() => {
      onSchemaChange?.(editor.getSchema());
    }).catch(err => {
      console.error('Form import error:', err);
    });

    editor.on('changed', () => {
      const schema = editor.getSchema();
      setFormSchema(schema);
      onSchemaChange?.(schema);
    });

    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy();
      }
    };
  }, [initialSchema, onSchemaChange]);

  const handleSaveForm = () => {
    if (!editorInstanceRef.current) return;

    const schema = editorInstanceRef.current.getSchema();
    const jsonStr = JSON.stringify(schema, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'form-schema.form';
    a.click();
    
    URL.revokeObjectURL(url);
  };

  const handleLoadForm = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const schema = JSON.parse(e.target.result);
        await editorInstanceRef.current.importSchema(schema);
        setFormSchema(schema);
        onSchemaChange?.(schema);
      } catch (err) {
        console.error('Form yükleme hatası:', err);
        alert('Form yüklenirken bir hata oluştu.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h3>Form Builder</h3>

      <div style={{ marginBottom: '1rem' }}>
        <button onClick={handleSaveForm}>Formu İndir</button>
        <label style={{ marginLeft: '10px', cursor: 'pointer' }}>
          Form Yükle
          <input
            type="file"
            accept=".form,.json"
            style={{ display: 'none' }}
            onChange={handleLoadForm}
          />
        </label>
      </div>

      <div 
        ref={formEditorRef}
        style={{ 
          border: '1px solid #ccc',
          height: 'calc(100vh - 150px)',
          position: 'relative'
        }}
      />
    </div>
  );
};

export default CamundaForm; 