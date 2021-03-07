import { observer } from 'mobx-react-lite'
import React, { ChangeEvent, useState } from 'react'
import { Segment, Form, Button } from 'semantic-ui-react'
import { useStore } from '../../../app/stores/store'

export default observer(function ActivityForm(){

    const { activityStore } = useStore();
    const { selectedActivity, closeForm, createActivity, updateActivity, loading} =activityStore;

    const initialState = selectedActivity ?? {
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
        activity.id ? updateActivity(activity) : createActivity(activity);
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
                <Form.Input type='Date' Placeholder='Date' value={activity.date} name='date' onChange={handleInputChange}/>
                <Form.Input Placeholder='City' value={activity.city} name='city' onChange={handleInputChange}/>
                <Form.Input Placeholder='Venue' value={activity.venue} name='venue' onChange={handleInputChange}/>
                <Button loading={loading} floated='right' positive type='submit' content='Submit' />
                <Button onClick={closeForm} floated='right' type='button' content='Cancel' />
            </Form>
        </Segment>
    )
})