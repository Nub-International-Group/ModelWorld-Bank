<template>
  <div class="animated fadeIn">
    <BRow>
      <BCol
        v-for="item in announcements"
        :key="item.title"
        md="12"
      >
        <BCard
          border-varient="secondary"
          :title="item.title"
          :sub-title="item.subtitle"
          sub-title-tag="h4"
          title-tag="h2"
          img-top
        >
          <p
            class="card-text"
            v-html="item.body"
          />
        </BCard>
      </BCol>
    </BRow>
  </div>
</template>

<script>
export default {
  name: 'Announcements',
  data: function () {
    return {
      announcements: [
        {
          title: 'NubBank announces new thing',
          subtitle: 'Extra, extra! Read all about it!',
          body: '<img class="w-100 h-auto p-3" src="https://placekitten.com/1000/300"></img><br>NubBank has today done something amazing, yet again.<br>We are <em>really</em> getting good at this shit. Honestly, I should get a promotion or something...<br><br>Yeah this is HTML, what about it?'
        },
        {
          title: 'NubBank does something AMAZING',
          subtitle: 'Oh my GOD, you would not want to miss this!',
          body: '<iframe height="500" class="w-100 p-3" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><br>Prepare to be wowed...<br>'
        }
      ]
    }
  }
}
</script>
