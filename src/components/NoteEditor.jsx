import React, { useState, useEffect, useRef } from 'react';
import { convertToRaw, convertFromRaw } from 'draft-js';
import Editor, { createEditorStateWithText } from '@draft-js-plugins/editor';
import { EditorState } from 'draft-js';
import createToolbarPlugin from '@draft-js-plugins/static-toolbar';
import createInlineToolbarPlugin from '@draft-js-plugins/inline-toolbar';
// import editorStyles from './editorStyles.module.css';
import '@draft-js-plugins/static-toolbar/lib/plugin.css';
import '@draft-js-plugins/inline-toolbar/lib/plugin.css';
import {
    ItalicButton,
    BoldButton,
    UnderlineButton,
    CodeButton,
    HeadlineOneButton,
    HeadlineTwoButton,
    HeadlineThreeButton,
    UnorderedListButton,
    OrderedListButton,
    BlockquoteButton,
    CodeBlockButton,
} from '@draft-js-plugins/buttons';

const inlineToolbarPlugin = createInlineToolbarPlugin();
const staticToolbarPlugin = createToolbarPlugin();

const InlineToolbar = inlineToolbarPlugin.InlineToolbar;
const plugins = [inlineToolbarPlugin, staticToolbarPlugin];
const { Toolbar } = staticToolbarPlugin;


const NoteEditor = ({ noteContent, loadNoteContent, setNoteContent }) => {
    const [editorState, setEditorState] = useState(noteContent ? EditorState.createWithContent(convertFromRaw(noteContent)) : createEditorStateWithText(''));
    const editorRef = useRef(null);
    
    // Focus on user click on editor
    const handleEditorFocus = () => {
        editorRef.current.focus();
    }

    const updateNoteContent = () => {
        const editorContent = editorState.getCurrentContent();
        const content =  convertToRaw(editorContent);
        setNoteContent(content);
    }


    return (
        <div
            className='note-editor'
            onClick={handleEditorFocus}>
            <Editor
                ref={editorRef}
                editorState={editorState}
                onChange={setEditorState}
                onBlur={updateNoteContent}
                plugins={plugins}
            />
            <InlineToolbar className='note-editor-toolbar'>
                {(externalProps) => (
                    <div>
                        <HeadlineOneButton {...externalProps} />
                        <HeadlineTwoButton {...externalProps} />
                        <HeadlineThreeButton {...externalProps} />
                        <BoldButton {...externalProps} />
                        <ItalicButton {...externalProps} />
                        <UnderlineButton {...externalProps} />
                        <CodeButton {...externalProps} />
                        <UnorderedListButton {...externalProps} />
                        <OrderedListButton {...externalProps} />
                        <BlockquoteButton {...externalProps} />
                    </div>
                )
                }
            </InlineToolbar>
            {/* <Toolbar /> */}
        </div>

    );
}

export default NoteEditor;