import axios from "axios";
import app from '@/main'
import router from "@/router";


function deleteEpisode(episode, callback){
    app.$confirm(`This will permanently delete episode "${episode.title}". Continue?`, 'Warning', {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }).then(() => {
      axios.delete(`episodes/${episode.id}/`).then(() => {
        app.$message({type: 'success', message: `Episode '${episode.title}' successful deleted.`});
        if (callback){
            callback()
        }
      })
    });
}

function downloadEpisode(episode){
    if (episode.status === 'downloading'){
      app.$message({type: 'warning', message: `Episode "${episode.title}" is downloading now.`});
      return
    }

    if (episode.status === 'new'){
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

function goToEpisode(episode){
  router.push({name: 'episodeDetails', params: {'episodeID': episode.id, 'podcastID': this.podcast.id}}).then(() => {})
}

function humanStatus(status){
    const statuses = {
        "new": "New",
        "downloading": "Downloading",
        "published": "Published",
        "archived": "Archived",
        "error": "Error"
    }
    return statuses[status] || status
}


export {deleteEpisode, downloadEpisode, humanStatus, goToEpisode}