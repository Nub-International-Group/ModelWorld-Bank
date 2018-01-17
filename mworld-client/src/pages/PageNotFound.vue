<template>
  <div id="PageNotFound">
    <div class="page-header">
      <h1>Error 404
        <small>Resource not found.</small>
      </h1>
    </div>
    <br>
    <blockquote>
      <h4>{{quotes[Math.floor(random * quotes.length)][0]}}</h4>
      <footer>{{quotes[Math.floor(random * quotes.length)][1]}}
        <cite title="Source Title">{{quotes[Math.floor(random * quotes.length)][2]}}</cite>
      </footer>
    </blockquote>
    <br>
    <h3 class="text-center">This probably isn't the page you wanted. I'm sorry...</h3>
    <p class="text-center"><router-link to="/"><button type="button" class="btn btn-primary btn-lg ">Go Home</button></router-link></p>
    <img class="center-block img-responsive" src="http://www.yes-minister.com/images/oth_humphreycup.jpg" /></div>
  </div>
</template>

<script>
export default {
  name: 'PageNotFound',
  data: function () {
    return {
      quotes: [
      ['Not all those who wander are lost.', 'J.R.R. Tolkien', 'The Fellowship of the Ring'],
      ['Some beautiful paths can\'t be discovered without getting lost.', 'Erol Ozan', ''],
      ['You\'ve got to find yourself first. Everything else\'ll follow.', 'Charles de Lint', 'Dreams Underfoot'],
      ['They say that when one door closes, another opens. \n This is not that door', 'Lewis Miller', '']
      ],
      random: Math.random()
    }
  }
}
</script>