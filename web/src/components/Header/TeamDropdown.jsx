import React, { useState } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { Dropdown, Icon, Menu } from 'antd';
import { createSession } from '../../utility/restCalls';
import './style.css';

function TeamDropdown({ history }) {
  const [toTeam, setToTeam] = useState(false);

  const displayLoading = async (event) => {
    try {
      localStorage.setItem(
        'currentTeam',
        JSON.stringify({
          id: JSON.parse(localStorage.getItem('teams'))[event.key - 1].id,
        })
      );
      await createSession(event);
      window.location.reload();
      // Works for now but will want to change this to simply refetch data with the new room session
      // Or put the localStorage item as dependency for dashboard useEffect
    } catch (err) {
      console.log(err);
    }
  };

  const verifyTeamsValue = (teams) => {
    try {
      if (teams == null) return false;
      JSON.parse(teams);
      return true;
    } catch (err) {
      return false;
    }
  };

  const menu = (
    <Menu className='dropdownMenu'>
      <Menu.Item
        key='0'
        onClick={() => {
          setToTeam(!toTeam);
        }}
      >
        <Icon type='appstore' />
        Overview
      </Menu.Item>
      {verifyTeamsValue(localStorage.getItem('teams')) &&
        JSON.parse(localStorage.getItem('teams')).map((team, index) => {
          return (
            <Menu.Item
              key={index + 1}
              onClick={(event) => {
                displayLoading(event);
              }}
              style={{ fontWeight: JSON.parse(localStorage.getItem('currentTeam')).id === team.id ? 500 : 'initial' }}
            >
              <Icon type='team' />
              {team.name}
            </Menu.Item>
          );
        })}
    </Menu>
  );

  return toTeam ? (
    <Redirect push to='/team' />
  ) : (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Dropdown.Button
        overlay={menu}
        style={{ margin: '0 1.3rem 0 1.3rem' }}
        icon={<Icon type='switcher' />}
        onClick={() => {
          setToTeam(true);
        }}
      >
        Switch Team
      </Dropdown.Button>
    </div>
  );
}

export default withRouter(TeamDropdown);
