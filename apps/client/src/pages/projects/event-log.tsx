import {useAuth} from "@client/context/auth";
import {useProject} from "@client/lib/store/projectStore";
import {useEffect} from "react";
import {IEvent} from "@abflags/shared";
import { JsonView, allExpanded, darkStyles, defaultStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';
import {formatCreatedDate} from "@client/lib/utils";

export default function EventLog() {
  const {token} = useAuth()
  const {eventLogs, fetchEventLogs} = useProject()

  console.log(eventLogs)

  useEffect(() => {
    fetchEventLogs({
      page: 0,
      size: 10
    })
  }, [token])
  return (
    <div className={'grid grid-cols-1 gap-3'}>
      {eventLogs.data?.map(e => (
        <EventCard event={e} key={e._id}/>
      ))}
    </div>
  )
}

const EventCard = ({event}: {event: IEvent}) => {
  return (
    <div className={'flex rounded-lg bg-gray-100 dark:bg-gray-900 p-1'}>
      <div className={'max-w-96 grid grid-cols-2 gap-1 p-3'}>
        <div>Event Id</div>
        <div>{event._id}</div>
        <div>Change at</div>
        <div>{formatCreatedDate(event.createdAt)}</div>
        <div>Event:</div>
        <div>{event.type}</div>
        <div>Change by:</div>
        <div>{event.createdBy}</div>
      </div>
      <div className={'flex-1 flex flex-col p-3 bg-white rounded-lg dark:bg-gray-800'}>
        <div>Changes:</div>
        {event.data && <JsonView data={event.data} shouldExpandNode={allExpanded} style={{
          ...defaultStyles,
          container: 'bg-transparent'
        }} />}
      </div>
    </div>
  )
}
