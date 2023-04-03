import { motion } from 'framer-motion';
import React from 'react';

const ErrorToast = (props: any) => {
  const { children } = props;
  const toastProps = {
    layout: true,
    initial: { opacity: 0, y: 50, scale: 0.3 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, scale: 0.5, transition: { duration: 0.2 } },
  };
  return <motion.div {...toastProps}>{children}</motion.div>;
};

export default ErrorToast;
