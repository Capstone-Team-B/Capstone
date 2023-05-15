import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/core";
import globalStyles from "../../utils/globalStyles";

const EventTile = ({ event, uid }) => {
    const navigation = useNavigation();

    // function to format date/date range
    const formatDateRange = (dateA, dateB) => {
        let dateOrDateRange;
        const daysOfTheWeek = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ];
        const monthName = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];
        let convertDateA = new Date(dateA);
        let convertDateB = new Date(dateB);
        if (dateA === dateB) {
            const dayOfWeek = daysOfTheWeek[convertDateA.getDay()];
            const day = Number(dateA.slice(8, 10));
            const month = monthName[dateA.slice(5, 7) - 1];
            const year = Number(dateA.Aslice(0, 4));
            dateOrDateRange = `${dayOfWeek} ${day} ${month} ${year}`;
            return dateOrDateRange;
        }

        const startDay = daysOfTheWeek[convertDateA.getDay()];
        const startDate = Number(dateA.slice(8, 10));
        const startMonth = monthName[dateA.slice(5, 7) - 1];
        const startYear = Number(dateA.slice(0, 4));

        const endDay = daysOfTheWeek[convertDateB.getDay()];
        const endDate = Number(dateB.slice(8, 10));
        const endMonth = monthName[dateB.slice(5, 7) - 1];
        const endYear = Number(dateB.slice(0, 4));

        if (startMonth === endMonth && startYear === endYear) {
            dateOrDateRange = `${startDay} through ${endDay}, ${startDate}-${endDate} ${startMonth} ${startYear}`;
            return dateOrDateRange;
        } else if (startMonth !== endMonth && startYear === endYear) {
            dateOrDateRange = `${startDay} through ${endDay}, ${startDate} ${startMonth} - ${endDate} ${endMonth} ${startYear}`;
            return dateOrDateRange;
        } else if (startYear !== endYear) {
            dateOrDateRange = `${startDay} through ${endDay}, ${startDate} ${startMonth} ${startYear} - ${endDate} ${endMonth} ${startYear}`;
            return dateOrDateRange;
        }
    };

    return (
        <TouchableOpacity
            onPress={() => navigation.navigate("SingleEvent", { event })}
        >
            <View
                key={event.id}
                style={
                    uid === event.host_id ? styles.itemHost : styles.itemGuest
                }
            >
                <Text style={globalStyles.heading2}>{event.name}</Text>
                <Text style={globalStyles.paragraph}>{new Date(event.startDate).toLocaleDateString(
                                              "en-US",
                                              {
                                                  weekday: "short",
                                                  month: "short",
                                                  day: "numeric",
                                                  year: "numeric",
                                              }
                                          )} - {new Date(event.endDate).toLocaleDateString(
                                              "en-US",
                                              {
                                                  weekday: "short",
                                                  month: "short",
                                                  day: "numeric",
                                                  year: "numeric",
                                              }
                                          )}</Text>
                <Text style={globalStyles.paragraph}>{event.location}</Text>
                <Text style={globalStyles.paragraph}>{event.description}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default EventTile;

const styles = StyleSheet.create({
    itemGuest: {
        margin: 10,
        borderWidth: 2,
        borderColor: "dodgerblue",
        padding: 10,
        borderRadius: 10,
    },
    itemHost: {
        margin: 10,
        borderWidth: 2,
        borderColor: "#cb6ce6",
        backgroundColor: "plum",
        padding: 10,
        borderRadius: 10,
    },
    eventHeader: {
        fontSize: 18,
        fontWeight: "bold",
    },
    eventSubHeader: {
        fontSize: 16,
        fontWeight: "bold",
    },
    eventDesc: {
        fontSize: 14,
    },
});
