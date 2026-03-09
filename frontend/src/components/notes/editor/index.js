import React, { Fragment, useState, useEffect } from 'react';

import ReactQuill from 'react-quill'; // ES6
import 'react-quill/dist/quill.snow.css'; // ES6

function Editor(props) {
  const [currentContent, setCurrentContent] = useState('')
  const [timer,setTimer] = useState(null);

const updateNote = (content) => {
      const title = content.replace(/(<([^>]+)>)/ig, "").slice(0, 30);
      props.updateNote(props.note, {'title': title, 'body': content})
}

const handleChange = (content,delta,source) => {

      clearTimeout(timer);
       // condição com o change for disparado pelo usuário, vai ser atualizado o contéudo, chamando o setCurrentContent com o próprio content, e vai ser 
       // chamado o setTimer, nele vai ser utilizado o setTimeout, que vai aceitar uma função como parametro que é a função de updateNote
       //
     if(source == 'user'){
        setCurrentContent(content);
        setTimer(setTimeout(()=>{ updateNote(content) }, 2000));
     }

    }


  useEffect(()=> {
    if (props.note && props.note.body) {
    setCurrentContent(props.note.body)
  }
  }, [props.note])



  const modules = {
    toolbar: [
      [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
      [{'list': 'ordered'}, {'list': 'bullet'}, 
       {'indent': '-1'}, {'indent': '+1'}],
      ['link'],
      ['clean'],
    ]
  }

  return (
    <Fragment>
      <ReactQuill value={currentContent} modules={modules} onChange={handleChange}/>
    </Fragment>
  )
}

export default Editor;
