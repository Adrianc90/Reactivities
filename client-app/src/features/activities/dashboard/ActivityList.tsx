import { observer } from 'mobx-react-lite';
import React, { SyntheticEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Item, ItemContent, ItemHeader, Label, Segment } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';


export default observer(function ActivityList() {
    const [target, setTartget] = useState('');
    const { activityStore } = useStore();
    const { deleteActivity, activitiesByDate, loading } = activityStore;

    function handleActiviyDelete(e: SyntheticEvent<HTMLButtonElement>, id: string) {
        setTartget(e.currentTarget.name);
        deleteActivity(id);
    }

    return (
        <Segment>
            <Item.Group divided>
                {activitiesByDate.map(activity => (
                    <Item key={activity.id}>
                        <ItemContent>
                            <ItemHeader as='a'>{activity.title}</ItemHeader>
                            <Item.Meta>{activity.date}</Item.Meta>
                            <Item.Description>
                                <div>{activity.description}</div>
                                <div>{activity.city}, {activity.venue}</div>
                            </Item.Description>
                            <Item.Extra>
                                <Button as={Link} to={`/activities/${activity.id}`} floated='right' content='View' and color='blue' />
                                <Button name={activity.id} loading={loading && target === activity.id} onClick={(e) => handleActiviyDelete(e, activity.id)} floated='right' content='Delete' and color='red' />
                                <Label basic content={activity.category} />
                            </Item.Extra>
                        </ItemContent>
                    </Item>
                ))}
            </Item.Group>
        </Segment>
    )
})