import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Layout, subheader } from '../../globalStyles';
import { Calendar, Icon, Row } from 'antd';
import { LinkWrapper, OverdueIssue } from './ScheduleStyles';
import { getIssues } from '../../utility/restCalls';
import { ThemeContext } from '../../colors/theme';
import './schedule.css';

export default function Schedule() {
  const [theme] = useContext(ThemeContext);
  const [overdueIssues, setOverdueIssues] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const {
        data: { activeItems, progressItems, completedItems },
      } = await getIssues('team');
      const issues = [...activeItems, ...progressItems, ...completedItems];
      setOverdueIssues(findOverdueIssues(issues));
      setLoading(false);
      setData(issues.filter((item) => item.deadline));
    })().catch((err) => {
      console.log(err);
    });
  }, []);

  const findOverdueIssues = (issues) => {
    let counter = 0;
    const currentDate = new Date().getTime();
    const deadlineIssues = issues.filter((item) => item.deadline != null);

    for (let issue of deadlineIssues) {
      if (new Date(issue.deadline).getTime() < currentDate) {
        counter++;
      }
    }
    return counter;
  };

  const compareDates = (date, deadline) => {
    function getMonth(date) {
      let month = date.getUTCMonth() + 1;
      return month < 10 ? '0' + month : '' + month;
    }

    function getDay(date) {
      let day = date.getUTCDate() + 1;
      return day < 10 ? '0' + day : '' + day;
    }

    const deadlineObj = new Date(deadline);
    deadlineObj.setMinutes(deadlineObj.getMinutes() - new Date().getTimezoneOffset());
    const deadlineDate = parseInt(
      deadlineObj.getUTCFullYear().toString() + getMonth(deadlineObj) + getDay(deadlineObj)
    );

    const calendarObj = new Date(date);
    const calendarDate = parseInt(
      calendarObj.getUTCFullYear().toString() + getMonth(calendarObj) + getDay(calendarObj)
    );
    if (deadlineDate) return deadlineDate === calendarDate;
  };

  const dateCellRender = (value) => {
    return (
      <div
        className='events'
        style={{ overflow: 'auto', display: 'flex', alignItems: 'flex-end', flexDirection: 'column' }}
      >
        {data.map((item, index) => {
          return compareDates(value, item.deadline) ? (
            <LinkWrapper key={index} theme={theme}>
              {/* <Badge
                status="error"
                text={
                  <a href="google.ca" target="_blank">
                    Issue 10
                  </a>
                }
              /> 
              // Use this badge in future for mobile view or smaller screens
            */}
              <Link to={`/dashboard/issue/${item.id}`} style={{ color: 'white' }} target='_blank'>
                Issue {item.id}
              </Link>
            </LinkWrapper>
          ) : null;
        })}
      </div>
    );
  };

  return (
    <Layout theme={theme}>
      <Row type='flex' style={{ alignItems: 'center' }}>
        <p style={{ ...subheader, color: theme.textColor, opacity: loading ? 0.3 : 1, marginBottom: '1rem' }}>
          Project Schedule
        </p>
        {overdueIssues > 0 && <OverdueIssue>1 overdue issue(s)</OverdueIssue>}
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
      <Calendar
        dateCellRender={dateCellRender}
        className={theme.isLightMode ? '' : 'dark-theme'}
        style={{
          display: loading ? 'none' : 'block',
        }}
      />
    </Layout>
  );
}
