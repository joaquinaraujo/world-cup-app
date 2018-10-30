    const EventBus = new Vue()

    // Group A Row
    Vue.component('Row', {
      props: [ 'name', 'mp', 'w', 'd', 'l', 'gf', 'ga', 'gd', 'pts' ],
      template: `
        <tr
          :id="name.replace(' ', '-')"
        >
          <td>
            <span
              :class="name[0]"
            >
            </span>
            {{ name }}
          </td>
          <td>{{ mp }}</td>
          <td>{{ w }}</td>
          <td>{{ d }}</td>
          <td>{{ l }}</td>
          <td>{{ gf }}</td>
          <td>{{ ga }}</td>
          <td>{{ gd }}</td>
          <td>{{ pts }}</td>
        </tr>
      `
    })

    // Classified
    Vue.component('Classified', {
      props: [ 'soccerTeams' ],
      template: `
        <section
          class="classified"
        >
          <h3>Soccer Teams Classified</h3>
          <table>
            <thead>
              <tr>
                <th>Team</th>
                <th>MP</th>
                <th>W</th>
                <th>D</th>
                <th>L</th>
                <th>GF</th>
                <th>GA</th>
                <th>GD</th>
                <th>PTS</th>
              </tr>
            </thead>
            <tbody
              id="tbody"
            >
              <template
                v-for="(team, index) in soccerTeams"
              >
                <row
                  :name="team.name"
                  :mp="team.mp"
                  :w="team.w"
                  :d="team.d"
                  :l="team.l"
                  :gf="team.gf"
                  :ga="team.ga"
                  :gd="team.gd"
                  :pts="team.pts"
                />
              </template>
            </tbody>
          </table>
        </section>
      `
    })

    // Questions Country
    Vue.component('Country', {
      props: [ 'i', 'matchId', 'countryId', 'name' ],
      template: `
        <div
          :match="matchId"
        >
          <template
            v-if="i % 2"
          >
            <input
              :country="countryId"
              min="0"
              max="9999"
              type="number"
              value="0"
              @change="handleChange"
            />
            <span
              :class="name[0]">
            </span>
            {{ name }}
          </template>
          <template
            v-else
          >
            {{ name }}
            <span
              :class="name[0]">
            </span>
            <input
              :country="countryId"
              min="0"
              max="9999"
              type="number"
              value="0"
              @change="handleChange"
            />
          </template>
        </div>
      `,
      methods: {
        handleChange (ev) {
          const teamId = ev.target.getAttribute('country')
          const teamGols = ev.target.value
          const matchId = ev.target.parentElement.getAttribute('match')

          EventBus.$emit('gol', Number(matchId), Number(teamId), Number(teamGols))
        }
      }
    })

    // Matches
    Vue.component('Matches', {
      props: [ 'matchId', 'match' ],
      template: `
        <div
          class="match"
        >
          <template
            v-for="(team, index) in match"
          >
            <country
              :i="index"
              :matchId="matchId"
              :countryId="team.id"
              :name="team.name"
            />
          </template>
        </div>
      `
    })

    // Questions
    Vue.component('Questions', {
      props: [ 'matches' ],
      template: `
        <section
          class="questions"
        >
          <h3>Soccer Teams</h3>
          <div
            class="questions"
          >
            <matches
              v-for="(match, key) in matches"
              :matchId="key"
              :match="match"
            />
          </div>
        </section>
      `
    })

    // Main
    const App = Vue.component('App', {
      data () {
        return {
          soccerTeams: [],
          matches: [],
          matched: false
        }
      },
      template: `
        <main>
          <h1>2018 Russia World Cup Group A</h1>
          <h2>How do you think will be the group A?</h2>
          <questions
            :matches="matches"
          />
          <classified
            :soccerTeams="soccerTeams"
          />
        </main>
      `,
      created () {
        class Team {
          constructor (id, name, extend) {
            this.id = id
            this.name = name
            this.mp = 0
            this.w = 0
            this.d = 0
            this.l = 0
            this.gf = 0
            this.ga = 0

            if (extend) {
              this.gd = 0
              this.pts = 0
            }
          }
        }

        this.soccerTeams = [
          new Team (0, 'Russia', true),
          new Team (1, 'Saudi Arabia', true),
          new Team (2, 'Egypt', true),
          new Team (3, 'Uruguay', true)
        ]

        this.matches = [
          [
            new Team (0, 'Russia'),
            new Team (1, 'Saudi Arabia')
          ],
          [
            new Team (2, 'Egypt'),
            new Team (3, 'Uruguay')
          ],
          [
            new Team (0, 'Russia'),
            new Team (2, 'Egypt')
          ],
          [
            new Team (3, 'Uruguay'),
            new Team (1, 'Saudi Arabia')
          ],
          [
            new Team (3, 'Uruguay'),
            new Team (0, 'Russia')
          ],
          [
            new Team (1, 'Saudi Arabia'),
            new Team (2, 'Egypt')
          ]
        ]

        EventBus.$on('gol', this.match)
      },
      methods: {
        wdl (firstTeam, secondTeam) {
          // Won
          function w (team) {
            team.w = true
            team.d = false
            team.l = false
          }

          // Draw
          function d (team) {
            team.w = false
            team.d = true
            team.l = false
          }

          // Loss
          function l (team) {
            team.w = false
            team.d = false
            team.l = true
          }

          if (firstTeam.gf > secondTeam.gf) {
            // Won
            w(firstTeam)
            // Loss
            l(secondTeam)
          } else if (firstTeam.gf === secondTeam.gf) {
            // Draw
            d(firstTeam)
            d(secondTeam)
          } else {
            // Loss
            l(firstTeam)
            // Won
            w(secondTeam)            
          }
        },
        pts () {
          // Reboot
          this.soccerTeams.forEach(team => {
            team.w = 0
            team.d = 0
            team.l = 0
            team.gf = 0
            team.ga = 0
            team.gd = 0
            team.pts = 0
          })

          // Gols
          function gols (soccerTeam, team) {
            soccerTeam.gf += team.gf
            soccerTeam.ga += team.ga
            soccerTeam.gd = soccerTeam.gf - soccerTeam.ga
          }

          // For in matches table
          this.matches.forEach(match => {
            match.forEach(team => {
              let soccerTeam = {}

              // Set team classified
              this.soccerTeams.forEach(t => {
                if (t.id === team.id) soccerTeam = t
              })

              // Set "Won"
              if (team.w) {
                soccerTeam.w += 1

                // Gols
                gols (soccerTeam, team)

                soccerTeam.pts += 3
              }

              // Set "Draw"
              if (team.d) {
                soccerTeam.d += 1

                // Gols
                gols (soccerTeam, team)

                soccerTeam.pts += 1
              }

              // Set "Loss"
              if (team.l) {
                soccerTeam.l += 1

                // Gols
                gols (soccerTeam, team)
              }
            })
          })
        },
        everyonePlayed () {
          if (!this.matched) {
            const teams = this.soccerTeams.filter(team => team.mp === 3)

            if (teams.length === 4) this.matched = true
          }
        },
        sort () {
          // Sort by pts for default
          const soccerTeams = this.soccerTeams
            .sort((a, b) => a.pts - b.pts)
            .reverse()

          if (this.matched) {
            // Check if there are teams with duplicate pts
            const duplicatePts = this.soccerTeams
              .filter((team, index, arr) => arr.findIndex(t => t.pts === team.pts) === index)

            const working = duplicatePts.map((team, index, arr) => {
              // Sort by ga for default
              const teamsPts = this.soccerTeams
                .filter(t => team.pts === t.pts)
                .sort((a, b) => a.gd - b.gd)
                .reverse()

              // Check if there are teams with duplicate ga
              const duplicateGa = teamsPts
                .filter((team, index, arr) => arr.findIndex(t => t.pts === team.pts) === index)

              return duplicateGa.map((team, index, self) => {
                // Sort by gf for default
                const teamsGa = teamsPts
                  .filter(t => team.pts === t.pts)
                  .sort((a, b) => a.gd - b.gd)
                  .reverse()

                return teamsGa
              })
            })

            // this.soccerTeams = working.flat()
            // The flat() method would do everything the code does from line 402 to 408

            const experimental = []
            
            working.forEach(teams => {
              teams.forEach(subTeam => {
                experimental.push(...subTeam)
              })
            })
            
            this.soccerTeams = experimental
          } else {
            this.soccerTeams = soccerTeams
          }
        },
        match (matchId, teamId, teamGols) {
          // GF|GA -> Match
          const match = this.matches[matchId]

          match.forEach(team => {
            if (team.id === teamId) {
              team.gf = teamGols
            } else {
              team.ga = teamGols
            }

            // MP - Match
            if (!team.mp) {
              team.mp = true
              this.soccerTeams.forEach(t => {
                if (t.id === team.id) t.mp++
              })
            }
          })

          // W/D/L - Match
          // function (firstTeam, secondTeam)
          this.wdl(match[0], match[1])

          // PTS - Matches
          this.pts()

          // Group phase completed?
          this.everyonePlayed()

          // Sort
          this.sort()
        }
      }
    })

