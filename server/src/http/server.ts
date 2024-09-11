import fastify from "fastify";
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from "fastify-type-provider-zod";
import { creatGoal } from "../functions/creat-goal";
import z from "zod";
import { getWeekPendingGoals } from "../functions/get-week-pending-goals";
import { creatGoalCompletion } from "../functions/creat-goal-completion";

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.get('/pending-goals', async () => {
    const { pendingGoals } = await getWeekPendingGoals()

    return { pendingGoals }
})

app.post('/goals', {
    schema:  {
        body: z.object({
            title: z.string(),
            desiredWeeklyFrequency: z.number().int().min(1).max(7), 
        }),
    }
}, async request => {
    const {title, desiredWeeklyFrequency} = request.body
  
    
    await  creatGoal({
        title,
        desiredWeeklyFrequency,
    })
})

app.post('/completions', {
    schema:  {
        body: z.object({
            goalId: z.string(),
        }),
    },
}, async request => {
    const {goalId} = request.body
  
    
    await  creatGoalCompletion({
        goalId,
    })
    
})

app.listen({
    port: 3333,
}).then(() => {
    console.log('HTTP server running!')
})