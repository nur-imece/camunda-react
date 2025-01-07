import React, { useEffect, useRef, useState } from 'react';
import { FormEditor } from '@bpmn-io/form-js-editor';
import '@bpmn-io/form-js-editor/dist/assets/form-js-editor.css';
import '@bpmn-io/form-js/dist/assets/form-js.css';

const CamundaForm = ({ initialSchema, onSchemaChange, editorRef }) => {
  const [formSchema, setFormSchema] = useState(initialSchema || {
    components: [],
    type: 'default',
    id: 'form-' + Date.now(),
    schemaVersion: 3
  });

  const formEditorRef = useRef(null);

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

    editorRef.current = editor;

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
      if (editorRef.current) {
        editorRef.current.destroy();
      }
    };
  }, [initialSchema, onSchemaChange, editorRef]);

  return (
    <div style={{ padding: '1rem' }}>
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