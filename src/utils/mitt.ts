import mitt from 'mitt';
const VueEmit = mitt();

const bus: any = {
  $emit: VueEmit.emit,
  $on: VueEmit.on,
  $off: VueEmit.off,
};
export { bus };
