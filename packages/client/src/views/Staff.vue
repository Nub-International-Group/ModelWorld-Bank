<template>
  <div class="animated fadeIn">
    <h3>Our Staff</h3>

    <BRow>
      <BCol
        v-for="item in staff"
        :key="item.name"
        md="6"
      >
        <BCard
          :title="item.name"
          :sub-title="item.job"
          :img-src="item.image"
          img-top
        >
          <p
            class="card-text"
            v-html="item.description"
          />
        </BCard>
      </BCol>
    </BRow>
  </div>
</template>

<script>
export default {
  name: 'Staff',
  data: function () {
    return {
      staff: [
        {
          name: 'His Grace the Duke of the Yorkshire Dales GCOE KCT',
          image: require('../assets/images/mcmahon.png'),
          job: 'Group Chairman',
          description: 'Padanub is a leading expert in the UK Banking and Corporate sector after an illustrious civil service career. After an illustrious political career as Conservative Party Chairman, Speaker of the House of Commons, and Private Secretary to the Sovereign, he now leads NubBank in our mission to build a platform for secure high net worth banking, alongside the Baron of Fingringhoe and the rest of his executive team, so that politicians may bank with confidence and with ease.'
        },
        {
          name: 'Baron Strideynet of Fingringhoe',
          image: require('../assets/images/falkvinge.png'),
          job: 'Group Chief Executive',
          description: 'Director and Chief Technical Officer for Nub Bank. Whilst mostly useless, he eventually gets the job done with the correct impetus. Politically he roams the House of Lords rambling about the <strong>\'Golden Days\'</strong><br><br>Strideynet first entered a banking foray with Modal Santander many moons ago. More recently he decided to get back into action by partnering with Padanub.'
        },
        {
          name: 'm1cha3lm',
          image: require('../assets/images/kofi.png'),
          job: 'Non Executive Director',
          description: 'm1cha3lm formerly worked in a management position at the MBBC before taking a hiatus from public life in late 2016. Upon returning, he returned to the Liberal Democrats and came to work at NubBank.'
        },
        {
          name: 'Confessions',
          image: require('../assets/images/david.png'),
          job: 'Group Chief Experience Officer',
          description: 'Confessions is a User Experience Tester and Advisor for Nub Bank. With a background in Web Development, he provides feature suggestions and works to improve the End User Experience. This is done alongside being a Member of Parliament for Kent, the Secretary of State for the Environment, Food and Rural Affairs and Chief Whip of the Conservative Party. With all of these roles, it is no wonder he has no free time.'
        }
      ]
    }
  }
}
</script>
