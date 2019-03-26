package com.bbi.fam.exception;


public class ExceptionUtils {

	/**
	 * Throw the <code>FamApplicationException</code> with the specified message and
	 * root cause.
	 * 
	 * @param message
	 *            the detail message
	 * 
	 * @param t
	 *            root cause
	 * @throws FamApplicationException
	 */
	public static final void throwFamApplicationException(String message, Throwable t) throws FamApplicationException {
		throw new FamApplicationException(message, t);
	}

	/**
	 * Throw the <code>FamApplicationException</code> with the specified message.
	 * 
	 * @param message
	 *            the detail message
	 * @throws FamApplicationException
	 */
	public static final void throwFamApplicationException(String message) throws FamApplicationException {
		throw new FamApplicationException(message);
	}

	/**
	 * Throw the <code>FamSystemException</code> with the specified message and root
	 * cause.
	 * 
	 * @param message
	 *            the detail message
	 * @param t
	 *            root cause
	 */
	public static final void throwFamSystemException(String message, Throwable t) {
		throw new FamSystemException(message, t);
	}

	/**
	 * Throw the <code>FamSystemException</code> with the specified message.
	 * 
	 * @param message
	 *            the detail message
	 */
	public static final void throwFamSystemException(String message) {
		throw new FamSystemException(message);
	}
}
