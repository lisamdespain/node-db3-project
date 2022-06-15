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


async function findById(scheme_id) { // EXERCISE B
  
     const result = await db('schemes as sc')
      .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
      .where({'sc.scheme_id': scheme_id})
      .select('sc.scheme_id as scheme_id', 'scheme_name', 'step_id', 'step_number', 'instructions')
      .orderBy('step_number')
      if (result.length == 0){
        return null
      }
     
      const schemeSteps = {
          scheme_id: result[0].scheme_id, 
          scheme_name: result[0].scheme_name,
          steps: result.filter(e => e.step_id != null).map(e => ({step_id: e.step_id, step_number: e.step_number, instructions: e.instructions})
          )
        }
        return schemeSteps;
}

function findSteps(scheme_id) { // EXERCISE C
  // from steps join schemes on schemes.scheme_id = steps.scheme_id 
// order by step_number
      return db('steps').join('schemes', 'steps.scheme_id', 'schemes.scheme_id')
      .where('steps.scheme_id', scheme_id)
      .select('step_id', 'step_number', 'instructions', 'scheme_name')
      .orderBy('step_number')
}
        


function add(scheme) { // EXERCISE D
  /*
    1D- This function creates a new scheme and resolves to _the newly created scheme_.
  */
  return db('schemes').insert(scheme).then(([id])=>{
    return findById(id)
  })
}

async function addStep(scheme_id, step) { // EXERCISE E
  /*
    1E- This function adds a step to the scheme with the given `scheme_id`
    and resolves to _all the steps_ belonging to the given `scheme_id`,
    including the newly created one.
  */
 const newStep = {
  scheme_id: scheme_id,
  step_number: step.step_number,
  instructions: step.instructions
 }
 await db('steps').insert(newStep)
 return findSteps(scheme_id)
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep
}
