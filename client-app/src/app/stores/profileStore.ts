import { Photo, Profile } from '../models/profile';
import { makeAutoObservable, reaction, runInAction } from 'mobx';
import agent from '../api/agent';
import { store } from './store';

export default class ProfileStore {
    profile: Profile | null = null;
    loadingProfile = false;
    uploadingPhoto = false;
    loading = false;
    followings: Profile[] = [];
    loadingFollowings: boolean = false;
    activeTab: number = 0;

    constructor() {
        makeAutoObservable(this);
        reaction(
            () => this.activeTab,
            activeTab => {
                if (activeTab === 3 || activeTab === 4) {
                    const predicate = activeTab === 3 ? 'followers' : 'following';
                    this.loadFollowings(predicate);
                } else {
                    this.followings = [];
                }
            }
        )
    }

    setActiveTab = (activeTab: any) => {
        this.activeTab = activeTab;
    }

    get isCurrentUser() {
        if (store.userStore.user && this.profile) {
            return store.userStore.user.userName === this.profile.userName;
        }
        return false;
    }

    loadProfile = async (userName: string) => {
        this.loadingProfile = true;
        try {
            const profile = await agent.Profiles.get(userName);
            runInAction(() => {
                this.profile = profile;
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => {
                this.loadingProfile = false;
            });
        }
    }

    uploadPhoto = async (file: Blob) => {
        this.uploadingPhoto = true;
        try {
            const response = await agent.Profiles.uploadPhoto(file);
            const photo = response.data;
            runInAction(() => {
                if (this.profile) {
                    this.profile.photos?.push(photo);
                    if (photo.isMain && store.userStore.user) {
                        store.userStore.setImage(photo.url);
                        this.profile.image = photo.url;
                    }
                }
            })
        } catch (error) {
            console.log(error)
        } finally {
            runInAction(() => this.uploadingPhoto = false);
        }
    }

    setMainPhoto = async (photo: Photo) => {
        this.loading = true;
        try {
            await agent.Profiles.setMainPhoto(photo.id);
            store.userStore.setImage(photo.url);
            runInAction(() => {
                if (this.profile && this.profile.photos) {
                    this.profile.photos.find(p => p.isMain)!.isMain = false;
                    this.profile.photos.find(p => p.id === photo.id)!.isMain = true;
                    this.profile.image = photo.url;
                }

            })
        } catch (error) {
            console.log(error)
        } finally {
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    deletePhoto = async (photo: Photo) => {
        if (photo.isMain) return null;
        this.loading = true;
        try {
            await agent.Profiles.deletePhoto(photo.id);
            if (this.profile && this.profile.photos) {
                this.profile.photos = this.profile.photos.filter(p => p.id !== photo.id)
            }
        } catch (error) {
            console.log(error)
        } finally {
            runInAction(() => this.loading = false)
        }
    }

    updateFollowing = async (userName: string, following: boolean) => {
        this.loading = true;
        try {
            await agent.Profiles.updateFollowing(userName);
            store.activityStore.updateAttendeeFollowing(userName);
            runInAction(() => {
                if (this.profile && this.profile.userName !== store.userStore.user?.userName && this.profile.userName !== userName) {
                    following ? this.profile.followersCount++ : this.profile.followersCount--;
                    this.profile.following = !this.profile.following;
                }
                if(this.profile && this.profile.userName === store.userStore.user?.userName){
                    following ? this.profile.followingCount++ : this.profile.followingCount--;
                }
                this.followings.forEach(profile => {
                    if (profile.userName === userName) {
                        profile.following ? profile.followingCount-- : profile.followingCount++;
                        profile.following = !profile.following;
                    }
                })
            });
        } catch (error) {

        } finally {
            runInAction(() => this.loading = false);
        }
    }

    loadFollowings = async (predicate: string) => {
        this.loadingFollowings = true;
        try {
            const followings = await agent.Profiles.listFollowings(this.profile!.userName, predicate);
            runInAction(() => {
                this.followings = followings;
            })
        } catch (error) {
            console.log(error)
        } finally {
            runInAction(() => this.loadingFollowings = false);
        }
    }
}
