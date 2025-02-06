import React, { createContext, useState } from 'react';

const Context = createContext();

export const Provider = ({ children }) => {
    const [state, setState] = useState({
        user: null,
        chartsData: [],
        userGrowthData: [],
        topSongs: [],
        revenueData: []
    });

    const updateUser = (user) => {
        setState((prevState) => ({ ...prevState, user }));
    };

    const updateChartsData = (data) => {
        setState((prevState) => ({ ...prevState, chartsData: data }));
    };

    const updateUserGrowthData = (data) => {
        setState((prevState) => ({ ...prevState, userGrowthData: data }));
    };

    const updateTopSongs = (data) => {
        setState((prevState) => ({ ...prevState, topSongs: data }));
    };

    const updateRevenueData = (data) => {
        setState((prevState) => ({ ...prevState, revenueData: data }));
    };

    return (
        <Context.Provider 
            value={{ 
                state, 
                updateUser, 
                updateChartsData,
                updateUserGrowthData,
                updateTopSongs,
                updateRevenueData
            }}
        >
            {children}
        </Context.Provider>
    );
};

export default Context;