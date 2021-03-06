import React, { useEffect, useState, useRef, useContext } from 'react';
import { Badge, Descriptions, Progress, Row, Icon, Spin } from 'antd';
import { Layout } from '../../globalStyles';
import { Bar, BarChart, XAxis, YAxis, Legend, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { getIssues, getLogsForGraph } from '../../utility/restCalls';
import { API_ENDPOINT } from '../../constants';
import { ThemeContext } from '../../colors/theme';
import axios from 'axios';
import './overview.css';

// Determine graph's x axis based on current month
const relativeLogsObject = () => {
  const currentMonth = new Date().getMonth();

  const logsObject = [
    { name: 'January', 'tasks created': 0, 'tasks completed': 0 },
    { name: 'Februry', 'tasks created': 0, 'tasks completed': 0 },
    { name: 'March', 'tasks created': 0, 'tasks completed': 0 },
    { name: 'April', 'tasks created': 0, 'tasks completed': 0 },
    { name: 'May', 'tasks created': 0, 'tasks completed': 0 },
    { name: 'June', 'tasks created': 0, 'tasks completed': 0 },
    { name: 'July', 'tasks created': 0, 'tasks completed': 0 },
    { name: 'August', 'tasks created': 0, 'tasks completed': 0 },
    { name: 'September', 'tasks created': 0, 'tasks completed': 0 },
    { name: 'October', 'tasks created': 0, 'tasks completed': 0 },
    { name: 'November', 'tasks created': 0, 'tasks completed': 0 },
    { name: 'December', 'tasks created': 0, 'tasks completed': 0 },
  ];

  const relativeLogsObject = [];
  for (let i = 0; i < 12; i++) {
    let conversion = i + (12 - currentMonth);
    if (conversion < 12) {
      relativeLogsObject[i] = logsObject[conversion];
    } else {
      relativeLogsObject[i] = logsObject[conversion - 12];
    }
  }
  return { relativeLogsObject };
};

const logsToData = (logs) => {
  const { relativeLogsObject: logsObject } = relativeLogsObject();
  const monthMap = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  for (let log of logs) {
    const month = new Date(log.date).getMonth();
    let monthIndex = 0; // actual month index in my log object
    for (let i = 0; i < logsObject.length; i++) {
      if (logsObject[i].name === monthMap[month]) {
        monthIndex = i;
        break;
      }
    }

    let tasksCreated = logsObject[monthIndex]['tasks created'];
    let tasksCompleted = logsObject[monthIndex]['tasks completed'];

    if (log.type === 0) {
      logsObject[monthIndex]['tasks created'] = ++tasksCreated;
    } else if (log.type === 12) {
      logsObject[monthIndex]['tasks completed'] = ++tasksCompleted;
    } else if (log.type === 13) {
      const issues = JSON.parse(log.object).issues;
      tasksCompleted += issues.length;
      logsObject[monthIndex]['tasks completed'] = tasksCompleted;
    }
  }
  return logsObject;
};

export default function Overview() {
  const [theme] = useContext(ThemeContext);

  const [loading, setLoading] = useState(true);
  const [backlogIssues, setBacklogIssues] = useState([]);
  const [issues, setIssues] = useState({
    activeItems: [],
    progressItems: [],
    completedItems: [],
  });
  const [logs, setLogs] = useState([]); // for graph
  const isMounted = useRef(true);

  useEffect(() => {
    (async () => {
      let { data: activeData } = await getIssues('team');
      let { data: backlog } = await axios.get(`${API_ENDPOINT}/issue/team/0`);
      let { data: logs } = await getLogsForGraph();
      if (isMounted.current) {
        setIssues(activeData);
        setBacklogIssues(backlog);
        setLogs(logsToData(logs));
        setLoading(false);
      }
    })().catch((err) => {
      console.log(err);
    });

    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <Layout theme={theme}>
      <Row type='flex' style={{ alignItems: 'center' }}>
        <p
          style={{
            opacity: loading ? 0.3 : 1,
            color: theme.textColor,
            fontSize: '2rem',
            marginBottom: '1rem',
          }}
        >
          Project Overview
        </p>
        {loading && (
          <Icon
            type='loading'
            spin
            style={{
              color: '#6ca1d8',
              fontSize: '1.4rem',
              margin: '0 0 1rem 1rem',
            }}
          />
        )}
      </Row>

      <Spin tip='Loading...' spinning={loading}>
        <Descriptions bordered style={{ backgroundColor: theme.overview.tableBgColor }}>
          <Descriptions.Item label='Sprint Completion' span={3}>
            <Row type='flex' style={{ flexWrap: 'nowrap', alignItems: 'center' }}>
              <Badge
                status='processing'
                text={<span style={{ color: theme.textColor }}>Running</span>}
                style={{ minWidth: '5rem' }}
              />
              <Progress
                className={theme.isLightMode ? '' : 'dark-theme-text'}
                strokeColor={{
                  from: '#108ee9',
                  to: '#87d068',
                }}
                percent={Math.round(
                  (issues.completedItems.length /
                    (issues.activeItems.length + issues.progressItems.length + issues.completedItems.length) || 0) * 100
                )}
                status='active'
              />
            </Row>
          </Descriptions.Item>
          <Descriptions.Item label='Active Tasks'>
            <span style={{ color: theme.textColor }}>{issues.activeItems.length}</span>
          </Descriptions.Item>
          <Descriptions.Item label='In Progress Tasks'>
            <span style={{ color: theme.textColor }}>{issues.progressItems.length}</span>
          </Descriptions.Item>
          <Descriptions.Item label='Completed Tasks'>
            <span style={{ color: theme.textColor }}>{issues.completedItems.length}</span>
          </Descriptions.Item>
          <Descriptions.Item label='Archived Tasks'>
            <span style={{ color: theme.textColor }}>0</span>
          </Descriptions.Item>
          <Descriptions.Item label='Tasks in backlog'>
            <span style={{ color: theme.textColor }}>{backlogIssues.length}</span>
          </Descriptions.Item>
        </Descriptions>
      </Spin>
      <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', textAlign: 'center' }}>
        <p style={{ color: theme.textColor, fontSize: '1.5rem', marginTop: '2rem' }}>Issue Analysis</p>
        {!loading && (
          <ResponsiveContainer width={'99%'} height={400}>
            <BarChart
              data={logs}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
              style={{ color: theme.isLightMode ? '' : '#e8e8e8' }}
            >
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' tick={{ fill: theme.textColor }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey='tasks created' fill='#8884d8' />
              <Bar dataKey='tasks completed' fill='#82ca9d' />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
      {/* <Progress
        type='circle'
        strokeColor={{
          '0%': '#79B7D4',
          '100%': '#79B7D4',
        }}
        percent={20}
      /> */}
    </Layout>
  );
}

/*
  const exampleData = [
    {
      name: 'January',
      'tasks created ': 5,
      'tasks completed': 0,
    },
  ];
*/
