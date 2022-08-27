import axios from "axios";
import app from '@/main'
import router from "@/router";


function deleteEpisode(episode, callback) {
    app.$confirm(`This will permanently delete episode "${episode.title}". Continue?`, 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        cancelButtonClass: 'is-plain',
        type: 'warning'
    }).then(() => {
        axios.delete(`episodes/${episode.id}/`).then(() => {
            app.$message({type: 'success', message: `Episode '${episode.title}' successful deleted.`});
            if (callback) {
                callback()
            }
        })
    });
}

function downloadEpisode(episode) {
    if (episode.status === 'downloading') {
        app.$message({type: 'warning', message: `Episode "${episode.title}" is downloading now.`});
        return
    }

    if (episode.status === 'new') {
        axios.put(`episodes/${episode.id}/download/`).then(() => {
            app.$message({type: 'success', message: `Downloading has been started.`});
            episode.status = 'downloading'
        })
    } else {
        app.$confirm('This will remove downloaded and reload new episode. Continue?', 'Warning', {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            cancelButtonClass: 'is-plain',
            type: 'warning'
        }).then(() => {
            axios.put(`episodes/${episode.id}/download/`).then(() => {
                app.$message({type: 'success', message: `Downloading has been started.`});
                episode.status = 'downloading'
            })
        });
    }
    let timeInterval = setInterval(() => {
        axios.get(`episodes/${episode.id}/`).then((response) => {
            episode.status = response.data.payload.status
            if (episode.status !== 'downloading'){
                clearInterval(timeInterval)
            }
        })
        },
       5000
    )
    return timeInterval
}

function goToEpisode(episode, podcastID) {
    router.push({name: 'episodeDetails', params: {'episodeID': episode.id, 'podcastID': podcastID}}).then(() => {
    })
}

function humanStatus(status) {
    const statuses = {
        "new": "New Episode",
        "downloading": "Downloading",
        "published": "Episode published",
        "archived": "Archived",
        "error": "Downloading error",
        "pending": "Pending",
        "episode_downloading": "Downloading",
        "episode_postprocessing": "Post processing",
        "episode_uploading": "Uploading to the cloud",
        "cover_downloading": "Cover is downloading",
        "cover_uploading": "Cover is uploading",
    }
    return statuses[status] || status
}

function fillFormErrors(serverErrors, formErrorsList) {
    console.log('serverErrors, formErrors', serverErrors, formErrorsList)
    if (typeof serverErrors.details === 'object') {
        for (let key in serverErrors.details) {
            let serverError = serverErrors.details[key]
            if (serverError) {
                formErrorsList.forEach((formErrors) => {
                    if (Array.isArray(serverError)) {
                        formErrors[key] = serverError
                    } else {
                        formErrors[key] = [serverError]
                    }
                })
            }
        }
        console.log(serverErrors)
    }
}

function isPlaylistURL(url) {
    const markers = ["playlist", "album"]
    for (let marker in markers){
        if (url.indexOf(marker) !== -1){
            return true
        }
    }
    return false
}

async function formIsValid(context, formRef) {
    try {
        await context.$refs[formRef].validate()
    } catch (err) {
        console.log("form is not valid", formRef, err)
        return false
    }
    console.log("form is valid")
    return true
}

function deletePodcast(podcast, callback){
  app.$confirm(`This will permanently delete the podcast "${podcast.name}" and included episodes. Continue?`, 'Warning', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    cancelButtonClass: 'is-plain',
    type: 'warning',
  }).then(() => {
    axios.delete(`podcasts/${podcast.id}/`).then(() => {
      app.$message({type: 'success', message: `Podcast '${podcast.name}' successful deleted.`});
      if (callback) {
         callback()
      }
    })
  });
}

function copyToClipboard(value){
    const el = document.createElement('textarea');
    el.value = value;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    app.$message({type: 'success', message: `Copied`});
}

function closeSidebar(){
  app.$store.commit('setSidebarOpen', false)
}

export {
    deleteEpisode, downloadEpisode, deletePodcast, humanStatus, goToEpisode, fillFormErrors,
    formIsValid, copyToClipboard, closeSidebar, isPlaylistURL
}
