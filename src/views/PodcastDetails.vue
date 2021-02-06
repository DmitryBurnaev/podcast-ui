<template>
  <div class="content">
        <div class="row">
          <div class="col-md-4">
            <div class="card card-user">
              <div class="image">
                <img src="../assets/img/damir-bosnjak.jpg" alt="...">
              </div>
              <div class="card-body">
                <div class="author">
                  <a href="#">
                    <img class="avatar border-gray" :src="podcast.image_url" alt="...">
                    <h5 class="title">{{ podcast.name }}</h5>
                  </a>
                </div>
                <p class="description text-center"> {{ podcast.description }} </p>
              </div>
              <div class="card-footer">
                <hr>
                <div class="button-container">
                  <div class="row">
                    <div class="col-lg-12 col-md-12 col-12 ml-auto text-center">
                      <h5 v-if="!loading">
                        {{ episodes.length }}<br>
                        <small>Episodes</small>
                      </h5>
                      <small v-else>loading</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-8">
            <div class="card card-user">
              <div class="card-header">
                <h5 class="card-title">Edit Profile</h5>
              </div>
              <div class="card-body">
                <form>
                  <div class="row">
                    <div class="col-md-5 pr-1">
                      <div class="form-group">
                        <label>Company (disabled)</label>
                        <input type="text" class="form-control" disabled="" placeholder="Company" value="Creative Code Inc.">
                      </div>
                    </div>
                    <div class="col-md-3 px-1">
                      <div class="form-group">
                        <label>Username</label>
                        <input type="text" class="form-control" placeholder="Username" value="michael23">
                      </div>
                    </div>
                    <div class="col-md-4 pl-1">
                      <div class="form-group">
                        <label for="exampleInputEmail1">Email address</label>
                        <input type="email" class="form-control" placeholder="Email">
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-6 pr-1">
                      <div class="form-group">
                        <label>First Name</label>
                        <input type="text" class="form-control" placeholder="Company" value="Chet">
                      </div>
                    </div>
                    <div class="col-md-6 pl-1">
                      <div class="form-group">
                        <label>Last Name</label>
                        <input type="text" class="form-control" placeholder="Last Name" value="Faker">
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-12">
                      <div class="form-group">
                        <label>Address</label>
                        <input type="text" class="form-control" placeholder="Home Address" value="Melbourne, Australia">
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-4 pr-1">
                      <div class="form-group">
                        <label>City</label>
                        <input type="text" class="form-control" placeholder="City" value="Melbourne">
                      </div>
                    </div>
                    <div class="col-md-4 px-1">
                      <div class="form-group">
                        <label>Country</label>
                        <input type="text" class="form-control" placeholder="Country" value="Australia">
                      </div>
                    </div>
                    <div class="col-md-4 pl-1">
                      <div class="form-group">
                        <label>Postal Code</label>
                        <input type="number" class="form-control" placeholder="ZIP Code">
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-12">
                      <div class="form-group">
                        <label>About Me</label>
                        <textarea class="form-control textarea">Oh so, your weak rhyme You doubt I'll bother, reading into it</textarea>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="update ml-auto mr-auto">
                      <button type="submit" class="btn btn-primary btn-round">Update Profile</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
            <div class="col-12">
                <div class="card">
              <div class="card-header">
                <h4 class="card-title">Episodes</h4>
              </div>
              <div class="card-body">
                <ul class="list-unstyled team-members">
                  <li v-for="episode in episodes" :key="episode.id">
                    <div class="row">
                      <div class="col-md-1 col-1">
                        <div class="avatar">
                          <img :src="episode.image_url" alt="Circle Image" class="img-circle img-no-padding img-responsive">
                        </div>
                      </div>
                      <div class="col-md-7 col-7">
                        {{ episode.title }}
                        <br />
                        <span class="text-success"><small>Downloaded</small></span>
                      </div>
                      <div class="col-md-3 col-3 text-right">
                        <btn class="btn btn-sm btn-outline-success btn-round btn-icon"><i class="fa fa-envelope"></i></btn>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
        </div>
            </div>
        </div>
      </div>



<!--    <div class="content content-podcast-details">-->
<!--        <h2>Podcast Details</h2>-->
<!--        <div class="post">-->

<!--        &lt;!&ndash; todo: move to common component &ndash;&gt;-->
<!--        <div v-if="loading" class="loading">-->
<!--          <p style="text-align: center">Загрузка...</p>-->
<!--        </div>-->

<!--        <div v-if="podcast" class="content">-->
<!--          <h2>Podcast {{ podcast.id }}</h2>-->
<!--          <p style="text-align: center">{{ podcast.id }}</p>-->
<!--          <p style="text-align: center">{{ podcast.name }}</p>-->
<!--          <p style="text-align: center">{{ podcast.description }}</p>-->
<!--          <p style="text-align: center"><img :src="podcast.image_url" alt=""></p>-->
<!--          <p style="text-align: center">{{ podcast.created_at }}</p>-->
<!--        </div>-->
<!--        <div class="episodes">-->
<!--          <ul>-->
<!--            <router-link v-for="episode in episodes" :key="episode.id"-->
<!--                tag="li"-->
<!--                active-class="active"-->
<!--                :to="{name: 'episodeDetails', params: {'id': episode.id}}"-->
<!--            >-->
<!--              #{{episode.id}} "{{episode.title}}"-->

<!--            </router-link>-->
<!--          </ul>-->


<!--        </div>-->

<!--      </div>-->
<!--    </div>-->
</template>

<script>
  export default {
    name: 'PodcastDetails',
    data: () => ({
        loading: true,
        podcast: null,
        episodes: [],
    }),
    async created() {
      await this.fetchData()
    },
    watch: {
      // при изменениях маршрута запрашиваем данные снова
      $route: 'fetchData'
    },
    methods: {
      async fetchData() {
        const podcastID = this.$route.params.id
        this.podcast = await this.$store.dispatch('getPodcastDetails', podcastID)
        this.episodes = await this.$store.dispatch('getEpisodes', podcastID)
        this.loading = false
      },
    }
  }
</script>