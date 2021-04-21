import React, { useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import ProfileHeader from './ProfileHeader';
import ProfileContent from './ProfileContent';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router';
import { useStore } from '../../app/stores/store';
import LoadingComponent from '../../app/layout/LoadingComponent';

export default observer(function ProfilePage() {
    const { userName } = useParams<{ userName: string }>();
    const { profileStore } = useStore();
    const { loadProfile, loadingProfile, profile, setActiveTab } = profileStore

    useEffect(() => {
        loadProfile(userName);
        return () => setActiveTab(0);
    }, [loadProfile, userName, setActiveTab])

    if (loadingProfile) return <LoadingComponent content='Loading Profile...' />

    return (
        <Grid>
            <Grid.Column width={16}>
                {profile &&
                    <>
                        <ProfileHeader profile={profile} />
                        <ProfileContent profile={profile} />
                    </>}
            </Grid.Column>
        </Grid>
    )
})

