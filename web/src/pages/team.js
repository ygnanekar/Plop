import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Button, Card, Icon, Input, Modal, Popconfirm, Row } from 'antd';
import { Redirect } from 'react-router-dom';
import { displayInfoDialog, displaySimpleNotification } from '../utility/services';
import { API_ENDPOINT } from '../utility/constants';
import { retrieveTeams } from '../utility/restCalls';

const { TextArea } = Input;

// Seperate this JS file into seperate components later
export default function Team() {
  let teamsObject = JSON.parse(localStorage.getItem('teams'));

  const [toDashboard, setToDashboard] = useState(false);
  const [teamCreation, setTeamCreation] = useState(false);
  const [teams, setTeams] = useState(teamsObject == null ? [] : teamsObject);
  const createTeamData = useRef({});
  const joinTeamData = useRef({});

  useEffect(() => {
    (async () => {
      const res = await retrieveTeams();
      setTeams(res.data);
      localStorage.setItem('teams', JSON.stringify(res.data));
    })().catch(err => {
      displaySimpleNotification('Error', 4, 'bottomRight', `Unable to retrieve teams. (${err})`, 'warning', 'red');
    });
  }, []);

  const handleLeaveTeam = async teamId => {
    try {
      await axios.post('/leaveRoom', { teamId });
      setTeams(
        teams.filter(item => {
          return item.id !== teamId;
        })
      );
    } catch (err) {
      displaySimpleNotification(
        'Error',
        4,
        'bottomRight',
        `Unable to leave team. If you are the owner, please delete the team through settings. (${err})`,
        'warning',
        'red'
      );
    }
  };

  const handleCreate = async () => {
    const data = {
      roomName: createTeamData.current.name,
      roomDescription: createTeamData.current.description,
      roomPassword: createTeamData.current.password,
    };

    try {
      const res = await axios.put(`${API_ENDPOINT}/room`, data);
      setTeams([
        ...teams,
        { name: res.data.name, description: res.data.description, id: res.data.id, currentMembers: '1' },
      ]);
      displayInfoDialog(
        'Team was successfully created!',
        'Your team ID is:',
        res.data.id,
        "These credentials were emailed to you as a backup and can also be found in your team settings. You may now enter the team's room."
      );
    } catch (err) {
      displaySimpleNotification(
        'Team was not created',
        5,
        'bottomRight',
        'This may be due to you being at your team limit (3) or exceeding input values (description < 300 characters and title < 100 characters).',
        'warning',
        'red'
      );
    } finally {
      setTeamCreation(false);
    }
  };

  const handleJoin = async () => {
    const data = {
      roomId: joinTeamData.current.id,
      roomPassword: joinTeamData.current.password,
    };

    try {
      await axios.post(`${API_ENDPOINT}/joinRoom`, data, { withCredentials: true });
      const res = await retrieveTeams();
      localStorage.setItem('teams', JSON.stringify(res.data));
      localStorage.setItem('currentTeam', data.roomId);
      setToDashboard(true);
    } catch (err) {
      displaySimpleNotification(
        'Unable to join team',
        4,
        'bottomRight',
        'You may have incorrect credentials or already have a pending request to join this team.',
        'warning',
        '#108ee9'
      );
    }
  };

  const handleCancel = () => {
    setTeamCreation(false);
  };

  const handleTeamCreation = e => {
    e.preventDefault();
    setTeamCreation(true);
  };

  const handleEnterTeam = async (e, team) => {
    e.preventDefault();
    localStorage.setItem('currentTeam', team);
    await axios.post(`${API_ENDPOINT}/sessionRoom`, { id: team });
    setToDashboard(true);
  };

  return toDashboard ? (
    <Redirect push to='/dashboard' />
  ) : (
    <>
      {teamCreation ? (
        <Modal
          title='Create a team'
          visible={true}
          onCancel={handleCancel}
          footer={[
            <Button key='back' onClick={handleCancel}>
              Return
            </Button>,
            <Button key='submit' type='primary' onClick={handleCreate}>
              Save
            </Button>,
          ]}
        >
          <p>Team name:</p>
          <Input
            style={{ marginBottom: '1rem' }}
            name='teamName'
            id='teamName'
            allowClear={true}
            maxLength={100}
            required
            onChange={e => {
              createTeamData.current.name = e.currentTarget.value;
            }}
          />
          <p>Team description:</p>
          <TextArea
            autosize={{ minRows: 2, maxRows: 6 }}
            style={{ marginBottom: '1rem' }}
            name='teamDescription'
            id='teamDescription'
            maxLength={250}
            required
            onChange={e => {
              createTeamData.current.description = e.currentTarget.value;
            }}
          />
          <p>Team password:</p>
          <Input.Password
            name='teamPassword'
            id='teamPassword'
            autoComplete='new-password'
            allowClear={true}
            required
            onChange={e => {
              createTeamData.current.password = e.currentTarget.value;
            }}
          />
        </Modal>
      ) : null}
      <div style={styles.container}>
        <div style={styles.subcontainer}>
          <Card title='Make a team' style={styles.card}>
            <p>
              <a href='/' onClick={e => handleTeamCreation(e)}>
                Create
              </a>{' '}
              a new team in order to begin managing your project!
            </p>
            <p>In total, you can only be a part of three maximum teams.</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
              <Icon
                type='plus-circle'
                style={{ fontSize: '2.5rem', paddingTop: '4rem', color: 'rgb(144, 181, 208)', cursor: 'pointer' }}
                onClick={e => handleTeamCreation(e)}
              />
            </div>
          </Card>
          <Card title='Join a team' style={styles.card}>
            <Input
              placeholder='Team ID'
              style={{ marginBottom: '2rem' }}
              allowClear={true}
              onChange={e => {
                joinTeamData.current.id = e.currentTarget.value;
              }}
            />
            <Input.Password
              placeholder='Team Password'
              autoComplete='new-password'
              allowClear={true}
              onChange={e => {
                joinTeamData.current.password = e.currentTarget.value;
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type='primary' style={{ marginTop: '1rem' }} onClick={() => handleJoin()}>
                Join
              </Button>
            </div>
          </Card>
        </div>
        <div style={{ display: 'flex', width: '100%', flex: '2' }}>
          <Card title='Teams joined' style={styles.card} extra={teams.length + '/3'}>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {teams.map((team, index) => {
                return (
                  <div style={styles.teams} key={index}>
                    <Card
                      title={'Team ' + team.name}
                      extra={team.currentMembers + ' member(s)'}
                      style={{ minHeight: '20rem' }}
                    >
                      <a href='/dashboard' onClick={e => handleEnterTeam(e, team.id)}>
                        Enter
                      </a>
                      <p>{team.description}</p>
                      <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <Popconfirm
                          title='Are you sure you want to leave this team?'
                          onConfirm={() => handleLeaveTeam(team.id)}
                          okText='Yes'
                          cancelText='No'
                        >
                          <Row type='flex' align='middle' style={{ cursor: 'pointer' }}>
                            <p style={{ margin: 0 }}>Leave</p>
                            <img
                              src='images/exit.svg'
                              alt='exit icon'
                              style={{
                                margin: '0 0.5rem',
                                width: '2rem',
                                transform: 'scaleX(-1)',
                                color: 'rgb(144, 181, 208)',
                              }}
                            />
                          </Row>
                        </Popconfirm>
                        <Icon
                          type='right-circle'
                          style={{
                            marginLeft: 'auto',
                            fontSize: '2.5rem',
                            paddingTop: '9rem',
                            color: '#848484b5',
                            cursor: 'pointer',
                          }}
                          onClick={e => handleEnterTeam(e, team.id)}
                        />
                      </div>
                    </Card>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    width: '100%',
    backgroundPosition: '0 0',
  },
  subcontainer: {
    display: 'flex',
    width: '100%',
    marginTop: '1rem',
  },
  card: {
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
    margin: '1rem',
    flex: 1,
  },
  teams: {
    flex: 1,
    margin: '0 1rem',
  },
};
