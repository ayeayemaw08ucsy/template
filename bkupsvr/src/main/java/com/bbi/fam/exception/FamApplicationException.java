package com.bbi.fam.exception;

public class FamApplicationException extends Exception {
	/** Serial Version UID. */
	private static final long serialVersionUID = 1121678359947192705L;

	/**
	 * Constructs an <code>RrsApplicationException</code> with the specified message
	 * and root cause.
	 * 
	 * @param message
	 *            the detail message
	 * @param t
	 *            root cause
	 */
	public FamApplicationException(String message, Throwable t) {
		super(message, t);
	}

	/**
	 * Constructs an <code>RrsApplicationException</code> with the specified
	 * message.
	 * 
	 * @param message
	 *            the detail message
	 */
	public FamApplicationException(String message) {
		super(message);
	}
}
