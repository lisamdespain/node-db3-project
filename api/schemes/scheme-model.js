const db = require('../../data/db-config')

function find() { // EXERCISE A
  /*
    1A- Study the SQL query below running it in SQLite Studio against `data/schemes.db3`.
    What happens if we change from a LEFT join to an INNER join?

      SELECT
          sc.*,
          count(st.step_id) as number_of_steps
      FROM schemes as sc
      LEFT JOIN steps as st
          ON sc.scheme_id = st.scheme_id
      GROUP BY sc.scheme_id
      ORDER BY sc.scheme_id ASC;

    2A- When you have a grasp on the query go ahead and build it in Knex.
    Return from this function the resulting dataset.
  */
 return db('schemes as sc')
 .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
 .groupBy('sc.scheme_id')
 .select('sc.scheme_id', 'scheme_name')
 .count('st.step_id as number_of_steps')
 .orderBy('sc.scheme_id')
}

async function findBySchemeID(id){
  return db('schemes').where('scheme_id', id);
}
async function findById(scheme_id) { // EXERCISE B
  /*
    1B- Study the SQL query below running it in SQLite Studio against `data/schemes.db3`:

      SELECT
          sc.scheme_name,
          st.*
      FROM schemes as sc
      LEFT JOIN steps as st
          ON sc.scheme_id = st.scheme_id
      WHERE sc.scheme_id = 1
      ORDER BY st.step_number ASC;

    2B- When you have a grasp on the query go ahead and build it in Knex
    making it parametric: instead of a literal `1` you should use `scheme_id`.

    3B- Test in Postman and see that the resulting data does not look like a scheme,
    but more like an array of steps each including scheme information:

      [
        {
          "scheme_id": 1,
          "scheme_name": "World Domination",
          "step_id": 2,
          "step_number": 1,
          "instructions": "solve prime number theory"
        },
        {
          "scheme_id": 1,
          "scheme_name": "World Domination",
          "step_id": 1,
          "step_number": 2,
          "instructions": "crack cyber security"
        },
        // etc
      ]

    4B- Using the array obtained and vanilla JavaScript, create an object with
    the structure below, for the case _when steps exist_ for a given `scheme_id`:

      {
        "scheme_id": 1,
        "scheme_name": "World Domination",
        "steps": [
          {
            "step_id": 2,
            "step_number": 1,
            "instructions": "solve prime number theory"
          },
          {
            "step_id": 1,
            "step_number": 2,
            "instructions": "crack cyber security"
          },
          // etc
        ]
      }

    5B- This is what the result should look like _if there are no steps_ for a `scheme_id`:

      {
        "scheme_id": 7,
        "scheme_name": "Have Fun!",
        "steps": []
      }
  */
      const result = await db('schemes')
      .leftJoin('steps', 'schemes.scheme_id', 'steps.scheme_id')
      .where({'schemes.scheme_id': scheme_id})
      .select('schemes.scheme_id as scheme_id', 'scheme_name', 'step_id', 'step_number', 'instructions')
      .orderBy('step_number')
      if (result.length == 0){
        return null
      }
     
        const schemeSteps = {
          scheme_id: result[0].scheme_id, 
          scheme_name: result[0].scheme_name,
          steps: result.filter(e => e.steps_id != null).map(e => ([{step_id: e.step_id, step_number: e.step_number, instructions: e.instructions}])
          )
        }
        return schemeSteps;
}

async function findSteps(scheme_id) { // EXERCISE C
  /*
    1C- Build a query in Knex that returns the following data.
    The steps should be sorted by step_number, and the array
    should be empty if there are no steps for the scheme:

      [
        {
          "step_id": 5,
          "step_number": 1,
          "instructions": "collect all the sheep in Scotland",
          "scheme_name": "Get Rich Quick"
        },
        {
          "step_id": 4,
          "step_number": 2,
          "instructions": "profit",
          "scheme_name": "Get Rich Quick"
        }
      ]
  */
//  select step_id, step_number, instructions, scheme_name 
// from schemes inner join steps on schemes.scheme_id = steps.scheme_id 
// order by step_number
      const result = await db('schemes')
      .leftJoin('steps', 'schemes.scheme_id', 'steps.scheme_id')
      .where({'schemes.scheme_id': scheme_id})
      .select('step_id', 'step_number', 'instructions', 'scheme_name')
      .orderBy('step_number')
      if (result.length == 0){
        return null
      }
     
        const schemeSteps = {
          posts: result.filter(e => e.steps_id != null).map(e => ({step_id: e.step_id, step_number: e.step_number, instructions: e.instructions, scheme_name: e.scheme_name})
          )
        }
        return schemeSteps;
}
        


function add(scheme) { // EXERCISE D
  /*
    1D- This function creates a new scheme and resolves to _the newly created scheme_.
  */
  return db('schemes').insert(scheme).then(([id])=>{
    return findById(id)
  })
}

function addStep(scheme_id, step) { // EXERCISE E
  /*
    1E- This function adds a step to the scheme with the given `scheme_id`
    and resolves to _all the steps_ belonging to the given `scheme_id`,
    including the newly created one.
  */
 return db('steps').insert(step).where({'steps.scheme_id': scheme_id})
 .then(([id])=>{
  return findById(id)
 })
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
  findBySchemeID
}
