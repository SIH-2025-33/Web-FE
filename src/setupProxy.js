 const { journeys, loading, error } = useJourneyData();
  const tripData = journeys.length > 0 ? journeys : sampleTripData;