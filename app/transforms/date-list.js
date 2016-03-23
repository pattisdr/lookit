import DS from 'ember-data';

export default DS.Transform.extend({
    deserialize(serialized) {
        var transform = new DS.DateTransform();
        return serialized.map((item) => transform.deserialize(item));
    },
    serialize(deserialized) {
        var transform = new DS.DateTransform();
        return (deserialized || []).map((item) => transform.serialize(item));
    }
});
