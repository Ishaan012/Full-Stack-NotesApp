import { useState } from 'react'
import NoteContext from './noteContext'

const NoteState = (props) => {

  const host = "http://localhost:5000"
  const notesInitial = [];
  const [notes, setNotes] = useState(notesInitial);

  //Get all Notes
  const getNotes = async () => {
    //API Call
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjViYmJhY2NlYTIwYTRiYWY5MWMxZWE5In0sImlhdCI6MTcwNjgwMTg2OH0.4Ld422KjnAWENr7jXsRtI2jvYph7zf9a9uNshrq-KZI"
      },
    });
    const json = await response.json()
    console.log(json);
    setNotes(json);
  }


  //Add a NOTE
  const addNote = async (title, description, tag) => {
    //TODO: API Call

    //API Call
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjViYmJhY2NlYTIwYTRiYWY5MWMxZWE5In0sImlhdCI6MTcwNjgwMTg2OH0.4Ld422KjnAWENr7jXsRtI2jvYph7zf9a9uNshrq-KZI"
      },
      body: JSON.stringify({ title, description, tag })
    });


    const note = {
      "_id": "65bbcb5dac8ffb715b9de4f4b",
      "user": "65bbbaccea20a4baf91c1ea9s",
      "title": title,
      "description": description,
      "tag": "personal",
      "date": "2024-02-01T16:48:29.909Z",
      "__v": 0
    };
    setNotes(notes.concat(note));
  }


  //Delete a Note
  const deleteNote = async (id) => {

    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjViYmJhY2NlYTIwYTRiYWY5MWMxZWE5In0sImlhdCI6MTcwNjgwMTg2OH0.4Ld422KjnAWENr7jXsRtI2jvYph7zf9a9uNshrq-KZI"
      },

    });
    const json = response.json();

    console.log("Deleting the note with id " + id);
    const newNote = notes.filter((note) => { return note._id !== id })
    setNotes(newNote);
  }



  //Edit a Note
  const editNote = async (id, title, description, tag) => {
    //API Call
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjViYmJhY2NlYTIwYTRiYWY5MWMxZWE5In0sImlhdCI6MTcwNjgwMTg2OH0.4Ld422KjnAWENr7jXsRtI2jvYph7zf9a9uNshrq-KZI"
      },
      body: JSON.stringify({ title, description, tag })
    });
    const json = response.json();

    //Logic to edit in client
    for (let index = 0; index < notes.length; index++) {
      const element = notes[index];
      if (element._id === id) {
        element.title = title;
        element.description = description;
        element.tag = tag;
      }
    }

  }
  return (
    <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
      {props.children}
    </NoteContext.Provider>
  )
}

export default NoteState;
