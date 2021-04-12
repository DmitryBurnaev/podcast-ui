import axios from "axios";
import app from '@/main'
import router from "@/router";


function deleteEpisode(episode, callback) {
    app.$confirm(`This will permanently delete episode "${episode.title}". Continue?`, 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
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
            type: 'warning'
        }).then(() => {
            axios.put(`episodes/${episode.id}/download/`).then(() => {
                app.$message({type: 'success', message: `Downloading has been started.`});
                episode.status = 'downloading'
            })
        });
    }
}

function goToEpisode(episode, podcastID) {
    router.push({name: 'episodeDetails', params: {'episodeID': episode.id, 'podcastID': podcastID}}).then(() => {
    })
}

function humanStatus(status) {
    const statuses = {
        "new": "New",
        "downloading": "Downloading",
        "published": "Published",
        "archived": "Archived",
        "error": "Error"
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
  this.$confirm('This will permanently delete the podcast and included episodes. Continue?', 'Warning', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning'
  }).then(() => {
    axios.delete(`podcasts/${podcast.id}/`).then(() => {
      this.$message({type: 'success', message: `Podcast '${podcast.name}' successful deleted.`});
      if (callback) {
         callback()
      }
    })
  });
}

export {deleteEpisode, downloadEpisode, deletePodcast, humanStatus, goToEpisode, fillFormErrors, formIsValid}