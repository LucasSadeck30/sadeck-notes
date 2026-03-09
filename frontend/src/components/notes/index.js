import { useState,Fragment, useEffect } from "react";
import React from "react";
import '../../styles/notes.scss';
import {push as Menu} from 'react-burger-menu';
import { Column } from "rbx";
import List from "./list";
import Editor from "./editor/index.js";
import NoteService from "../services/notes";
import Search from "./search/index.js";

const Notes =(props) =>{

const [notes, setNotes] = useState([]);
const [current_note, setCurrentNote] = useState(null);

async function fetchNotes(){
 
  const response = await NoteService.index();

  if(response.data.length >=1){
    setNotes(response.data.reverse());
    setCurrentNote(response.data[0]);
  }else{
    setNotes([]);
  }
}


const selectNote = (id) => {
  console.log(`O valor do id é ${id}`);
  
  const note = notes.find((note)=>{
    return note.id === id;
    })
  setCurrentNote(note);
}

const createNote = async () =>{
  await NoteService.create();
  fetchNotes()
}


const deleteNote = async (id) =>{
  console.log(`O valor que vem de delete note no parametro é ${id.id}`);
  
  await NoteService.delete(id.id);
  fetchNotes()
}


const updateNote = async (old, params) =>{
 const updatedNote = await NoteService.update(old.id, params);
 const index = notes.indexOf(old);
 const newNotes = notes;
 newNotes[index] = updatedNote.data;
  setNotes(newNotes);
  setCurrentNote(updatedNote.data);
}

const searchNotes = async (query) => {
  const response = await NoteService.search(query);
  setNotes(response.data);
}


useEffect(() => {
  fetchNotes();
}, []);


return(
<Fragment>
    <Column.Group className="notes" id="notes">
        <Menu
          pageWrapId={"notes-editor"}
          isOpen={props.isOpen}
          onStateChange={(state) => props.setIsOpen(state.isOpen)}
          disableAutoFocus
          outerContainerId={"notes"}
          customBurgerIcon={false}
          customCrossIcon={false}
        >
          <Column.Group>
            <Column size={10} offset={1}>
            <Search searchNotes={searchNotes} fetchNotes={fetchNotes}/>
            </Column>
          </Column.Group>
          <List notes={notes} selectNote={selectNote} current_note={current_note} createNote={createNote} deleteNote={deleteNote}/>
        </Menu>


        <Column size={12} className="notes-editor" id="notes-editor">
        <Editor note={current_note} updateNote={updateNote}/>
        </Column>
      </Column.Group>
</Fragment>
)
}
export default Notes;