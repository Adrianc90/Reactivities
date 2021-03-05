import React from 'react';
import { Grid } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';
import ActivityList from './ActivityList';
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from '../form/ActivityForm';

interface Props {
    activities: Activity[];
    selectedActivity: Activity | undefined;
    selectActiviy: (id: string) => void;
    cancelSelectActivity: () => void;
    editMode: boolean;
    openForm: (id: string) =>void;
    closeForm: () => void;
    createOrEdit: (activity: Activity)=> void;
    deleteActivity: (id: string) => void;
    submitting: boolean;
}

export default function ActivityDashboard({ activities, deleteActivity,
    selectedActivity, selectActiviy, cancelSelectActivity, editMode, openForm,
    submitting, closeForm, createOrEdit}: Props) {
    return (
        <Grid>
            <Grid.Column width='10'>
                <ActivityList activities={activities} 
                selectActiviy={selectActiviy} 
                deleteActivity={deleteActivity}
                submitting={submitting}
                />
            </Grid.Column>
            <Grid.Column width='6'>
                {selectedActivity && !editMode &&
                <ActivityDetails 
                    activity={selectedActivity} 
                    cancelSelectActivity={cancelSelectActivity} 
                    openForm={openForm}
                />}
                {editMode &&
                <ActivityForm 
                    closeForm={closeForm} 
                    activity={selectedActivity}
                    createOrEdit={createOrEdit}
                    submitting={submitting}
                />}
            </Grid.Column>
        </Grid>
    )
}


