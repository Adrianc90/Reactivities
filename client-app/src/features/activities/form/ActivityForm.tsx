import React, { ChangeEvent, useState } from 'react'
import { Segment, Form, Button } from 'semantic-ui-react'
import { Activity } from '../../../app/models/activity'

interface Props{
    closeForm: () => void;
    activity: Activity | undefined;
    createOrEdit: (activity: Activity)=> void;
}

export default function ActivityForm({closeForm, activity : selectedActiviy, createOrEdit} : Props){

    const initialState = selectedActiviy ?? {
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: ''
    }

    const [activity, setActivity] = useState(initialState);

    function handleSubmit(){
        createOrEdit(activity);
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>){
        const {name,value} =event.target;
        setActivity({...activity, [name]:value})
    }

    return(
        <Segment clearing>
            <Form onSubmit={handleSubmit} autoComplete='off'>
                <Form.Input Placeholder='Title' value={activity.title} name='title' onChange={handleInputChange}/>
                <Form.TextArea Placeholder='Description' value={activity.description} name='description' onChange={handleInputChange}/>
                <Form.Input Placeholder='Cateogry' value={activity.category} name='category' onChange={handleInputChange}/>
                <Form.Input Placeholder='Date' value={activity.date} name='date' onChange={handleInputChange}/>
                <Form.Input Placeholder='City' value={activity.city} name='city' onChange={handleInputChange}/>
                <Form.Input Placeholder='Venue' value={activity.venue} name='venue' onChange={handleInputChange}/>
                <Button floated='right' positive type='submit' content='Submit' />
                <Button onClick={closeForm} floated='right' type='button' content='Cancel' />
            </Form>
        </Segment>
    )
}