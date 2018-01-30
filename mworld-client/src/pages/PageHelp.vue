<template>
  <div class="PageHelp">
    <div>
      <div class="page-header">
        <h1>Help
          <small>Answers to all those questions on your mind!</small>
        </h1>
      </div>

      <div class="row">
        <div class="col-md-12">
          <div class="panel panel-default">
            <div class="panel-heading"><strong>Main Questions</strong></div>
            <ul class="list-group">
              <li class="list-group-item">
                <strong>What is Nub International Bank?</strong> <br>

                Nub International Bank is a minigame for the Model World, simulating personal finances for all members.
                It is gameified so we aren't all sat here worrying about bills to pay, but there will be financial challenges,
                events and other games to make and lose cash!
              </li>
              <li class="list-group-item">
                <strong>Is this canon?</strong> <br>

                  No, we are actively against it being canon purely for the fact that we will have to put a huge amount of work into realism.
              </li>
              <li class="list-group-item">
                <strong>How do I login?</strong> <br>

                There is a button on the top right of the website which will use your Reddit account to login.
                 We only need your basic identity data from Reddit (Join Date, Username, User ID) and will not have access
                to your posts or have the ability to post as you. By using OAuth2, we will never have access to your login credentials
                or any other personal information. However, by logging into the site you accept our terms and conditions.
              </li>
              <li class="list-group-item">
                <strong> How do I get an bank account?</strong> <br>

                All former ModelBarclays customers will have a bank account set up for them already,
                those who do not just need to PM /u/Padanub on Reddit or join the discord https://discord.gg/kCfQ9pM and request one in there.
              </li>
              <li class="list-group-item">
                <strong>Can I have more than one account?</strong> <br>

                Yes, although wages can only be paid into one.
              </li>
              <li class="list-group-item">
                <strong>Are there different types of account?</strong> <br>

                Not yet, but there will be. See the Features FAQ for more information.
              </li>
              <li class="list-group-item">
                <strong>The site doesn't look that appealing, Are you going to make it pretty?</strong> <br>

                Our next update is called the UX (User Experience) update. This update will bring a fresh new CSS as well as a new site experience.
              </li>
              <li class="list-group-item">
                <strong>Who do I contact for any questions not answered here?</strong> <br>

                PM /u/Padanub on Reddit or join the <a href="http://chat.nub.international">discord</a>
              </li>
              <li class="list-group-item">
                <strong>What is NigeBot?</strong> <br>

                NigeBot is a Discord Bot we use for some injokes and memes. Once we have the site in a more advanced state NigeBot will be able to do more to integrate with the site
              </li>
            </ul>
          </div>
        </div>
        <div class="col-md-12">
          <div class="panel panel-default">
            <div class="panel-heading"><strong>Wage Questions</strong></div>
            <ul class="list-group">
              <li class="list-group-item">
                <strong>How do I request wages?</strong> <br>

                Enter one of your bank accounts and on there is a small table titled Wages, there will be a button to request wages on there.
                Do not request wages for jobs you don't have, they will be declined.
              </li>
              <li class="list-group-item">
                <strong>Where are the wages for X?</strong> <br>

                We do allow for custom wages and when the UX Update comes you will be able to apply for custom wages on the site,
                for now any custom wage requests need to be sent to /u/Padanub
              </li>
              <li class="list-group-item">
                <strong>Why do Lords get the same wage as MPs?</strong> <br>

                Gamification. Lords get £300 a day and if they were to sit every day,
                five days a week they would be getting *roughly* what an MP gets a year so we decided for ease of use to roll it into the MP wage.
              </li>
              <li class="list-group-item">
                <strong> Are there pensions?</strong> <br>

                No, we currently don't have a viable way to implement pensions considering how many people are ex-ministers and the value of pensions.
              </li>
              <li class="list-group-item">
                <strong>How are wages paid?</strong> <br>

                Wages within NiB are designed to reflect the progression of time within the simulation of MHOC.
                The raw values of your wages will be totted up and then multiplied by 10 (the MHOC to IRL time multiplier).
                This provides a value for how much you should be paid per IRL year. We then divide this up by 365 and pay it nightly.
              </li>
              <li class="list-group-item">
                <strong>I'm being taxed?!? How?</strong> <br>

                Tax exists, deal with it. We base our tax rates off the most recently passed MHOC Budget and you will be taxed automatically in a similar manner to your wages.
                Better start voting tory if you're a high-earner :^)

              </li>
            </ul>
          </div>
        </div>
        <div class="col-md-12">
          <div class="panel panel-default">
            <div class="panel-heading"><strong>Feature Questions</strong></div>
            <ul class="list-group">
              <li class="list-group-item">
                <strong>What can I actually do on this?</strong> <br>

                At the moment due to development issues the built in features are limited, right now you are able to receive your wages,
                make bets externally and complete peer-2-peer transactions (Bribery, paying for services (design, consulting, advice, press appearances)
                cash for peers scandals or donations or money laundering, your imagination is your limit.)
                Once we have released a few more updates you will see what more is possible, see the Roadmap for more information.

              </li>
              <li class="list-group-item">
                <strong>What about feature X?</strong> <br>

                We currently have a slew of features planned in our Roadmap (insert roadmap link), if you wish to request something new then please speak to /u/Padanub
              </li>
              <li class="list-group-item">
                <strong>What about foreign wages/currencies?</strong> <br>

                Foreign Currency is already built into the site, however we won't be utilising it most likely until the
                Currencies update later down the line, so that cheeky job as Defence Secretary in Canada will have to wait.
              </li>
              <li class="list-group-item">
                <strong>Can we bet yet?</strong> <br>

                Yes! Betting will be built into the site after the UX Update, but for now /u/Padanub is running betting off a spreadsheet (ye olde system).
              </li>
              <li class="list-group-item">
                <strong>How do we bet?</strong> <br>

                An announcement in the NiG Discord will go up when a bet is active, all you need to do transfer the money you're betting to the NubBets Holding Account
                and use the reference/description "Bet: InsertOptionHere" and we will pick it up. Any incorrectly referenced bets will be returned.
              </li>
              <li class="list-group-item">
                <strong>Is there a limit on betting?</strong> <br>

                Yes, the maximum bet is £1,000,000. This is for balance reasons, any bets higher than this will be returned.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'PageHome'
  }
</script>
