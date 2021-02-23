import axios from "axios";
import router from "@/router";
import App from "@/App";


function deleteEpisode(episode, podcastID){
    App.$confirm(`This will permanently delete episode "${episode.title}". Continue?`, 'Warning', {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }).then(() => {
      return axios.delete(`episodes/${episode.id}/`).then(() => {
        App.$message({type: 'success', message: `Episode '${episode.title}' successful deleted.`});
        if (podcastID){
            router.push(`/podcasts/${podcastID}`).then(() => {})
        }
      })
    });
}

function downloadEpisode(episode){
    if (App.episode.status === 'downloading'){
      App.$message({type: 'warning', message: `Episode "${episode.title}" is downloading now.`});
      return
    }

    if (App.episode.status === 'new'){
      axios.put(`episodes/${episode.id}/download/`).then(() => {
        App.$message({type: 'success', message: `Downloading has been started.`});
      })
    } else {
      App.$confirm('This will remove downloaded and reload new episode. Continue?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        axios.put(`episodes/${episode.id}/download/`).then(() => {
          App.$message({type: 'success', message: `Downloading has been started.`});
        })
      });
    }
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


export {deleteEpisode, downloadEpisode, humanStatus}