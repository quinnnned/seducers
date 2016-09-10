import f from 'freddies';

export const combineSeducers = (seducers) => {
    const seducer = f(seducers);
    Object.keys(seducers || {}).forEach( (seducerKey) => {
        const subSeducer = seducers[seducerKey];
        Object.keys(subSeducer).forEach( (selectorKey) => {
            const selector = f(subSeducer[selectorKey]);
            seducer[selectorKey] = (state, ...rest) => selector(state[seducerKey], ...rest);
        });
    });
    return seducer;
};