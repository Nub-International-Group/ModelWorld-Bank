<template>
  <div class="PageStaff">
    <div>
      <div class="page-header">
        <h1>Staff
          <small>The employees of NiB</small>
        </h1>
      </div>

      <div class="row">
        <div class="col-md-12" v-for="item in staff">
          <img v-bind:src="item.image" class="img-responsive"/>
          <blockquote>
          <h3 class="text-center">{{item.job}}</h3>
          <h1 class="text-center">{{item.name}}</h1>
          <p class="text-center" v-html="item.description"></p>
          </blockquote>
          <hr>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'PageStaff',
    data: function () {
      return {
        staff: [
          {
            name: 'Marquess Padanub of Halifax KCT',
            image: require('../assets/bercow.jpg'),
            job: 'Chairman & Chief Executive',
            description: 'Padanub is a leading expert in the UK Banking and Corporate sector after an illustrious civil service career. He began as the Chairman of the Conservative Party, springing from there to become Speaker of the House of Commons where he became close with the Royal Household. When he departed the Speakers chair he became Private Secretary to the Sovereign and worked with the Queen in her day to day duties.\n' +
            '<br> <br>' +
            'He has led Nub International Group to new heights, building a platform for secure high net worth banking alongside the Baron of Fingringhoe, so that politicians may bank with confidence and with ease.\n'
          },
          {
            name: 'Baron Strideynet of Fingringhoe',
            image: require('../assets/falkvinge.png'),
            job: 'Director',
            description: `
              Director and Lead Programmer for Nub International Bank. Whilst mostly useless, he eventually gets the job done with the correct impetus. Politically he roams the House of Lords rambling about the <strong>'Golden Days'</strong>
              <br><br>
              Strideynet first entered a banking foray with Modal Santander many moons ago. More recently he decided to get back into action by partnering with Padanub.

            `
          },
          {
            name: 'Twistednuke MBE',
            image: require('../assets/dimble.png'),
            job: 'Finance Director',
            description: 'Twistednuke is leading the charge to improving user experience for the Nub Bank system when he’s not busy running the mBBC (at which his duties are to poke the other people at the mBBC and make sure they’re slaving away), he also inspects the office biscuits, often inspecting them so thoroughly that there are none left. At least this ensures no NIB employees are poisoned.'
          },
          {
            name: 'm1cha3lm',
            image: require('../assets/kofi.png'),
            job: 'Non Executive Director',
            description: 'm1cha3lm formerly worked in a management position at the MBBC before taking a hiatus from public life in late 2016. Upon returning, he returned to the Liberal Democrats and came to work at Nub International. An old time experienced man of the MHOC, he\'s expressly awaiting the upcoming real estate and stock markets from NiB.'
          },
          {
            name: 'ContrabannedTheMC',
            image: require('../assets/freeman.png'),
            job: 'Nub International Liaison',
            description: 'ContrabannedTheMC is a former Prime Minister who also ran the Model Sun. During his tenure at the Nub International Group he has been a right hand to Marquess Padanub of Halifax, offering many words of wisdom. As the Marquess is Chairman of NiB, he has appointed ContrabannedtheMC as the liaison to the NiG Board.'
          }
        ]
      }
    }
  }
</script>

<style scoped>

</style>
