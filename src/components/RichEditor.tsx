import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { convertToRaw, EditorState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Button } from '@nextui-org/react';
import { RichEditorProps } from '@/types/types';
const Editor = dynamic(() => import('react-draft-wysiwyg').then(mod => mod.Editor), { ssr: false });

const RichEditor: React.FC<RichEditorProps> = ({ onSubmit, confirmLabel }) => {
  const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty());

  const onEditorStateChange = (newEditorState: EditorState): void => {
    setEditorState(newEditorState);
  };
  const handleButtonClick = () => {
    const rawContentState = convertToRaw(editorState.getCurrentContent());
    if(editorState.getCurrentContent().hasText()){
      onSubmit(rawContentState);
      setEditorState(EditorState.createEmpty())
    }
  };
  return (
    <div>
      <div className='border'>
        <Editor
          editorState={editorState}
          onEditorStateChange={onEditorStateChange}
          wrapperClassName="wrapper-class"
          editorClassName="editor-class"
          toolbarClassName="toolbar-class"
        />
      </div>
      <div className='text-right mt-2'>
      <Button color="primary" variant="flat" onPress={handleButtonClick} >{confirmLabel}</Button>
      </div>
    </div>
  );
};

export default RichEditor;