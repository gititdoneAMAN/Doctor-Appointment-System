const { ChatGroq } = require('@langchain/groq');
const { ChatPromptTemplate } = require('@langchain/core/prompts');
const { StringOutputParser } = require('@langchain/core/output_parsers');
const doctorModel = require('../models/doctorModel');

const model = new ChatGroq({
  model: 'meta-llama/llama-4-maverick-17b-128e-instruct',
  temperature: 0,
});

const ChatAiCtrl = async (req, res) => {
  try {
    const { symptoms } = req.body;

    const doctors = await doctorModel.find({});
    const doctorList = JSON.stringify(
      doctors.map((doc) => ({
        name: `${doc.firstName} ${doc.lastName}`,
        specialization: doc.specialization,
      }))
    );

    const systemPrompt = `Consider yourself as a useful AI assistant who needs to help patients to identify suitable doctors according to their symptoms. You will be provided with a list of doctors from which you have to choose and identify suitable doctors who can treat the patients.`;

    const userPrompt = `
You need to do things in the following order.

Step1: Analyze the patient's symptoms.
Step2: Identify the most probable issue.
Step3: Choose suitable doctors based on the list.
Step4: Return the suitable doctor(s).

Always pick doctors only from the provided list.
Always give one sentense answer that just includes the name and specialization of the doctor.

Symptoms: {symptoms}
Doctor List: {doctorList}

`;

    const promptTemplate = ChatPromptTemplate.fromMessages([
      ['system', systemPrompt],
      ['user', userPrompt],
    ]);

    const chain = promptTemplate.pipe(model).pipe(new StringOutputParser());

    const response = await chain.invoke({
      symptoms,
      doctorList,
    });

    console.log(response);

    res.json({ message: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
};

module.exports = { ChatAiCtrl };
