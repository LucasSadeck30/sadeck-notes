import React, { Fragment } from 'react';
import { Button, Column, Tag, Title, List } from "rbx";
import Moment from 'moment';
import "../../../styles/notes.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

function ListNotes(props) {
     
  return (
    <Fragment>
      <Column.Group breakpoint="mobile">
        <Column size={6} offset={1}>
          <Title size={6}>
            {props.notes.length} Notes
          </Title>
             </Column> 
          <Column size={2}>
  <Button state="active" color="custom-purple" outlined size="small" onClick={() => props.createNote()}>
    Notes +
  </Button>
</Column>
     
      </Column.Group>
      <List className="notes-list">
        {props.notes.map((item, key) =>
        {
    console.log('Item completo:', item); // Debug: ver estrutura do objeto
    console.log('item._id:', item._id); 
          return( 
          <List.Item key={key} onClick={() => props.selectNote(item.id)} active={item._id === props.current_note?.id}   className={item.id === props.current_note?.id ? 'is-active' : ''}>
            <Title size={6}>
              {item.title.replace(/(<([^>]+)>)/ig, "").substring(0,15)}
            </Title>
            <Title size={6} subtitle spaced={false}>
              {item.body.replace(/(<([^>]+)>)/ig, "").substring(0,30)}
            </Title>

            <Column.Group breakpoint="mobile">
              <Column size={10}>
                <Tag color="dark">
                  {Moment(item.created_at).format('DD/MM')}
                </Tag>
              </Column>
              <Column size={2}>
  <FontAwesomeIcon 
    icon={faTrash} 
    onClick={() => props.deleteNote(item)}
    color="grey"
  />
</Column>
            </Column.Group>
          </List.Item>)


        } 
        
        )}
      </List>
    </Fragment>
  )
}
export default ListNotes;