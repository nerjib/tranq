import React, { useState, useEffect } from 'react';

const Rooms = () => {
    const [rooms, setRooms] = useState([]);
    const [online, setOnline] = useState(navigator.onLine);

    useEffect(() => {
        function handleOnline() {
            setOnline(true);
            synchronizeData()
        }
        function handleOffline() {
            setOnline(false);
            fetchOfflineRooms()
        }

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        if (online) {
            synchronizeData()
        } else {
            fetchOfflineRooms()
        }

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [online]);

    const synchronizeData = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/v1/lodge/rooms');
            const onlineRooms = await response.json();
            setRooms(onlineRooms);
            const result = await window.electronAPI.saveRoomsOffline(onlineRooms)
            if(!result.success) console.error(result.error)
        } catch (error) {
            console.error('Error fetching rooms:', error);
            fetchOfflineRooms()
        }
    }

    const fetchOfflineRooms = async () => {
        try {
            const rooms = await window.electronAPI.getRoomsOffline()
            console.log('offf', rooms);
            alert(JSON.stringify(rooms));
            setRooms(rooms)
        } catch (error) {
            console.error("Error fetching rooms offline:", error);
        }
    }

    return (
       <>
       <h1>rooms jj {rooms ? 'on' : 'off'}</h1>
       </>
    );
};

export default Rooms;