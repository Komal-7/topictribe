import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { convertToRaw, EditorState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Button } from '@nextui-org/react';
import { RichEditorProps } from '@/types/types';
import { stateToHTML } from 'draft-js-export-html';
const Editor = dynamic(() => import('react-draft-wysiwyg').then(mod => mod.Editor), { ssr: false });

const RichEditor: React.FC<RichEditorProps> = ({ onSubmit, confirmLabel }) => {
  const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty());

  const onEditorStateChange = (newEditorState: EditorState): void => {
    setEditorState(newEditorState);
  };
  const handleButtonClick = () => {
    const rawContentState = convertToRaw(editorState.getCurrentContent());

    onSubmit(rawContentState); // Pass the current editorState to the parent
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
      <div className='text-right mt-5'>
      <Button color="primary" variant="flat" onPress={handleButtonClick} >{confirmLabel}</Button>
      </div>
    </div>
  );
};

export default RichEditor;