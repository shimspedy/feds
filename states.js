document.addEventListener('DOMContentLoaded', () => {
    const states = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];
    const statesList = document.getElementById('states-list');

    states.forEach(state => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `state.html?state=${state}`;
        a.textContent = state;
        li.appendChild(a);
        statesList.appendChild(li);
    });
});
