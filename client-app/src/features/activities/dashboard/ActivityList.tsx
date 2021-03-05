import React, { SyntheticEvent, useState } from 'react';
import { Button, Item, ItemContent, ItemHeader, Label, Segment } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';

interface Props {
    activities: Activity[]
    selectActiviy: (id: string) => void;
    deleteActivity: (id: string) => void;
    submitting: boolean;
}

export default function ActivityList({ activities, selectActiviy, deleteActivity, submitting }: Props) {
    const [target, setTartget] = useState('');
    
    function handleActiviyDelete(e: SyntheticEvent<HTMLButtonElement>, id: string){
        setTartget(e.currentTarget.name);
        deleteActivity(id);
    }

    return (
        <Segment>
            <Item.Group divided>
                {activities.map(activity => (
                    <Item key={activity.id}>
                        <ItemContent>
                            <ItemHeader as='a'>{activity.title}</ItemHeader>
                            <Item.Meta>{activity.date}</Item.Meta>
                            <Item.Description>
                                <div>{activity.description}</div>
                                <div>{activity.city}, {activity.venue}</div>
                            </Item.Description>
                            <Item.Extra>
                                <Button onClick={() => selectActiviy(activity.id)} floated='right' content='View' and color='blue' />
                                <Button name={activity.id} loading={submitting && target===activity.id} onClick={(e) => handleActiviyDelete(e,activity.id)} floated='right' content='Delete' and color='red' />
                                <Label basic content={activity.category} />
                            </Item.Extra>
                        </ItemContent>
                    </Item>
                ))}
            </Item.Group>
        </Segment>
    )
}