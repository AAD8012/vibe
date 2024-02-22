<template>
  <Toast />
  <div style="display: flex">
    <div style="padding: 30px">
      <div>
        <div
          style="display: flex; padding-top: 30px"
          v-for="(item, index) in flights"
          :key="index"
        >
          <FloatLabel style="margin-right: 40px">
            <AutoComplete
              :inputId="`origin${index}`"
              v-model="item.origin"
              :suggestions="items"
              @complete="search"
              optionLabel="label"
              :inputStyle="{ width: '380px' }"
              @change="full(index)"
            />
            <label :for="`origin${index}`">Origen</label>
          </FloatLabel>
          <FloatLabel style="margin-right: 40px">
            <AutoComplete
              :inputId="`destination${index}`"
              v-model="item.destination"
              :suggestions="items"
              @complete="search"
              optionLabel="label"
              :inputStyle="{ width: '380px' }"
              @change="full(index)"
            />
            <label :for="`destination${index}`">Destino</label>
          </FloatLabel>
          <FloatLabel style="margin-right: 40px">
            <Calendar
              :inputId="`dates${index}`"
              v-model="item.dates"
              selectionMode="range"
              :manualInput="true"
              :minDate="today"
              @update:modelValue="full(index)"
            />
            <label :for="`dates${index}`">Fechas</label>
          </FloatLabel>
          <div>
            <Button
              icon="pi pi-times"
              severity="danger"
              aria-label="Cancel"
              label="Eliminar viaje"
              v-if="flights.length - 1 == index && index != 0"
              @click="deleteFlight()"
            />
          </div>
        </div>
      </div>
      <div style="padding: 30px 0px">
        <Button
          type="button"
          label="Agregar viaje"
          icon="pi pi-plus"
          :loading="loading"
          @click="addItem"
          :disabled="disableButton"
        />
      </div>
    </div>
    <div style="padding: 60px 30px">
      <Button
        type="button"
        label="Buscar"
        icon="pi pi-search"
        :loading="loading"
        @click="consultFlights"
        :disabled="disableButtonSearch"
        class="long-button"
      />
    </div>
  </div>
  <div class="card" style="padding: 30px">
    <TabView>
      <TabPanel header="El mejor">
        <div
          v-for="(flightQuality, index) in flightsQuality"
          style="margin-bottom: 30px; display: flex"
        >
          <div style="margin-right: 15px">
            Precio:{{ flightQuality.price }} MXN
          </div>
          <div style="margin-right: 15px">
            Aerolinea:{{ flightQuality.route[0].airlines[0] }}
          </div>
          <div
            style="display: flex; align-items: center; justify-content: center"
          >
            <Button type="button" label="Comprar" />
          </div>
        </div>
      </TabPanel>
      <TabPanel header="El mas economico">
        <div
          v-for="(flightPrice, index) in flightsPrice"
          style="margin-bottom: 30px; display: flex"
        >
          <div style="margin-right: 15px">
            Precio:{{ flightPrice.price }} MXN
          </div>
          <div style="margin-right: 15px">
            Aerolinea:{{ flightPrice.route[0].airlines[0] }}
          </div>
          <div
            style="display: flex; align-items: center; justify-content: center"
          >
            <Button type="button" label="Comprar" />
          </div>
        </div>
      </TabPanel>
      <TabPanel header="El mas rapido">
        <div
          v-for="(flightDuration, index) in flightsDuration"
          style="margin-bottom: 30px; display: flex"
        >
          <div style="margin-right: 15px">
            Precio:{{ flightDuration.price }} MXN
          </div>
          <div style="margin-right: 15px">
            Aerolinea:{{ flightDuration.route[0].airlines[0] }}
          </div>
          <div
            style="display: flex; align-items: center; justify-content: center"
          >
            <Button type="button" label="Comprar" />
          </div>
        </div>
      </TabPanel>
    </TabView>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import AutoComplete from "primevue/autocomplete";
import FloatLabel from "primevue/floatlabel";
import { useStore } from "vuex";
import { debounce } from "lodash";
import Calendar from "primevue/calendar";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import Button from "primevue/button";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";

const toast = useToast();
const store = useStore();
const flightsQuality = computed(() => {
  return store.getters.getFlightQuality;
});
const flightsPrice = computed(() => {
  return store.getters.getFlightPrice;
});
const flightsDuration = computed(() => {
  return store.getters.getFlightDuration;
});
const items = ref([]);
const today = new Date();
const loading = ref(false);
const flights = ref([
  {
    origin: "",
    destination: "",
    dates: null,
  },
]);
const deleteFlight = () => {
  flights.value.pop();
  disableButtonSearch.value = true;
};
const disableButton = ref(true);
const disableButtonSearch = ref(true);

const checkFlight = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 2000);
};

const full = (index) => {
  if (
    flights.value[index].origin !== "" &&
    flights.value[index].destination !== "" &&
    flights.value[index].dates !== null &&
    flights.value[index].dates[0] !== null &&
    flights.value[index].dates[1] !== null &&
    flights.value[index].dates[0] !== "" &&
    flights.value[index].dates[1] !== "" &&
    flights.value[index].dates.length == 2
  ) {
    disableButton.value = false;
  }
};

const fetchData = async (term) => {
  try {
    await store.dispatch("fetchData", { term: term });
    items.value = store.getters.getSelectedItems;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const debouncedFetchData = debounce(fetchData, 500);

const search = async (event) => {
  debouncedFetchData(event.query);
};
today.setHours(0, 0, 0, 0);

const addItem = () => {
  const newFlight = {
    origin: flights.value[flights.value.length - 1].destination,
    destination: "",
    dates: [flights.value[flights.value.length - 1].dates[1]],
  };
  flights.value.push(newFlight);
  disableButton.value = true;
  disableButtonSearch.value = false;
};

const validarVuelos = () => {
  return flights.value.every((flight) => {
    const noEmptyKeys = Object.keys(flight).every((key) => flight[key] !== "");
    const correctLength = flight.dates.length === 2;
    const noNullValues = correctLength
      ? flight.dates.every((date) => date !== null)
      : true;
    const validOrigin = flight.origin !== "";
    const validDestination = flight.destination !== "";
    return (
      noEmptyKeys &&
      correctLength &&
      noNullValues &&
      validOrigin &&
      validDestination
    );
  });
};
const consultFlights = async () => {
  loading.value = true;
  if (validarVuelos()) {
    console.log(flights.value);
    const via_blocks = flights.value.map((flight) => {
      return {
        fly_from: [flight.origin.value],
        fly_to: [flight.destination.value],
        dep_date_range: flight.dates.map((date) =>
          new Date(date).toLocaleDateString("en-GB")
        ),
      };
    });
    await store.dispatch("login", { via_blocks: via_blocks });
    loading.value = false;
    show("Busuqeda exitosa", "success", "Success Message");
  } else {
    loading.value = false;
    show("Debes de llenar todos los campos", "warn", "Warn Message");
  }
};
const show = (message, severity, summary) => {
  toast.add({
    severity: severity,
    summary: summary,
    detail: message,
    life: 3000,
  });
};
</script>

<style scoped>
.long-button {
  width: 200px;
}
</style>
