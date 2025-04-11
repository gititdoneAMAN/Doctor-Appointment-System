import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Button } from 'antd';
import axios from 'axios';

function ChatAi() {
  const [symptoms, setSymptoms] = useState('');
  const [res, setRes] = useState('');

  async function handleSubmit(symptoms) {
    const data = await axios.post(
      '/api/v1/user/chat-with-ai',
      {
        symptoms: symptoms,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    console.log(data.data.message);
    setRes(data.data.message);
  }
  return (
    <Layout>
      <h4 className='p-1 text-center'>Chat AI</h4>
      <div className='p-5'>
        <h5 className='text-center '>Enter your Symptoms</h5>
        <textarea
          rows={10}
          cols={110}
          className='p-2'
          placeholder='Enter your Symptoms.....'
          onChange={(e) => setSymptoms(e.target.value)}
        ></textarea>
        <div className='flex h-full w-full text-center justify-center items-center '>
          <Button
            className='bg-black text-white w-full'
            onClick={() => handleSubmit(symptoms)}
          >
            Submit
          </Button>
        </div>
        <div>{res}</div>
      </div>
    </Layout>
  );
}

export default ChatAi;
