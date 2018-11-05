/* eslint-disable linebreak-style */
'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
const isStar = true;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    const actions = {};

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            if (!actions.hasOwnProperty(event)) {
                actions[event] = [];
            }
            actions[event].push({ context, handler });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            const actionsName = Object.keys(actions)
                .filter((clue) => clue.startsWith(event + '.') || clue === event);
            for (let eventName of actionsName) {
                actions[eventName] = actions[eventName]
                    .filter(element => element.context !== context);
            }

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            let command = event.split('.');
            while (command.length > 0) {
                event = command.join('.');
                if (actions[event]) {
                    actions[event].forEach(element => element.handler.call(element.context));
                }
                command.pop();
            }

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {Object}
         */
        several: function (event, context, handler, times) {
            this.on(event, context, () => {
                if (times-- > 0) {
                    handler.call(context);
                }
            });

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Object}
         */
        through: function (event, context, handler, frequency) {
            let count = 0;
            this.on(event, context, () => {
                if (count++ % frequency === 0) {
                    handler.call(context);
                }
            });

            return this;

        }
    };
}

module.exports = {
    getEmitter,

    isStar
};
